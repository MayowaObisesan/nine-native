import {FlatList, Pressable, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useState} from "react";
import {LucideCheck} from "lucide-react-native";
import {MAX_CATEGORY_COUNT} from "~/lib/constants";
import {Badge} from "~/components/ui/badge";
import {useGetAppCategories} from "~/hook/useCategoriesList";
import {useNineContext} from "~/contexts";
import {useLocalSearchParams} from "expo-router";
import {useGetAppByName, useUpdateApp} from "~/hook/useApps";
import {toast} from "sonner-native";

const defaultAppsCategory = [
  "Business",
  "Education",
  "Entertainment",
  "Finance",
  "Games",
  "Health & Fitness",
  "Lifestyle",
  "Social",
  "Utilities"
] as const;

type Category = typeof defaultAppsCategory[number];

export default function AppCategory() {
  const {supabaseClient} = useNineContext();
  const {id} = useLocalSearchParams()
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const [updateAppCategoryData, setUpdateAppCategoryData] = useState<string[]>(app?.category?.split(",") || []);
  const updateApp = useUpdateApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const maxCategoryCount = MAX_CATEGORY_COUNT;
  const {data: appCategoryData, isLoading, error, refetch} = useGetAppCategories();

  const handleChange = (category: string) => {
    setUpdateAppCategoryData(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      }
      if (prev.length >= maxCategoryCount) {
        return prev;
      }
      return [...prev, category];
    });
  };

  const updateCategory = async () => {
    try {
      setIsSubmit(true);

      // const {data, error} = await supabaseClient
      //   .from(E_DBTables.Apps)
      //   .update({category: updateAppCategoryData.join(",")})
      //   .eq('name', id)
      //   .select()

      await updateApp.mutateAsync({
        id: id as string,
        updates: {category: updateAppCategoryData.join(",")}
      });

      toast.success("App category updated successfully.");
    } catch (error) {
      console.error("Error updating app category", error.message);
      toast.error("Error updating app category. Try again soon.");
    } finally {
      setIsSubmit(false);
    }
  };

  const renderSelectedCategory = ({item: category}: { item: string }) => (
    <View className="h-10 px-4 mx-2 my-2 rounded-full bg-base-100 dark:bg-[#222425] justify-center">
      <Text className="font-bold">{category}</Text>
    </View>
  );

  const renderCategoryItem = ({item: category}: { item: string }) => {
    const isSelected = updateAppCategoryData.includes(category);
    const isDisabled = !updateAppCategoryData.includes(category) &&
      updateAppCategoryData.length >= maxCategoryCount;

    return (
      <Pressable
        onPress={() => !isDisabled && handleChange(category)}
        className={`flex-row items-center h-20 px-5 rounded-3xl
                            ${isDisabled ? 'opacity-50' : ''}
                            ${isSelected ? 'bg-nine' : 'bg-background'}
                          `}
      >
        <Text className={`flex-1 ${isSelected ? 'font-bold text-nine-foreground' : ''}`}>
          {category}
        </Text>
        {isSelected && (
          <View className="justify-center items-center h-8 w-8 rounded-full bg-primary">
            <LucideCheck size={16} color="white" strokeWidth={4}/>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Update Category">
        <View className="flex-shrink-0 gap-x-2 w-auto block font-bold text-xl px-4">
          {
            updateAppCategoryData.length === maxCategoryCount
              ? <Badge className={"py-1 bg-error"}>
                <Text>Maximum selected</Text>
              </Badge>
              : <Badge>
                <Text className={"font-bold"}>{updateAppCategoryData.length} of {maxCategoryCount}</Text>
              </Badge>
          }
        </View>
      </NavHeaderLink>

      <View className="flex-1">
        {updateAppCategoryData.length > 0 &&
            <View className="py-4 border-b border-base-200 bg-white/60 dark:bg-[#111314]/60">
                <FlatList
                    data={updateAppCategoryData}
                    renderItem={renderSelectedCategory}
                    keyExtractor={item => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        }

        <FlatList
          data={appCategoryData}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          className="px-4"
          contentContainerStyle={{gap: 16, paddingVertical: 8}}
        />

        <View className="p-4">
          <Button
            onPress={updateCategory}
            disabled={updateAppCategoryData.length < 1}
            className="w-72 mx-auto rounded-xl bg-nine"
          >
            <Text>{isSubmit ? 'Saving...' : 'Save'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
