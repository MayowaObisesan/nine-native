import {ScrollView, TextInput, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {FormField, LabelField} from "~/components/Forms";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import * as React from "react";
import {useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {useGetAppByName, useUpdateApp} from "~/hook/useApps";
import {E_DBTables} from "~/types/enums";
import {toast} from "sonner-native";
import {useNineContext} from "~/contexts";

interface DownloadLinksData {
  playstore_link?: string;
  appstore_link?: string;
  external_link?: string;
}

export default function DownloadLinks() {
  const {supabaseClient} = useNineContext();
  const {id} = useLocalSearchParams()
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const [updateAppDownloadLinksData, setUpdateAppDownloadLinksData] = useState<DownloadLinksData>({});
  const updateApp = useUpdateApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (name: string, value: string) => {
    setUpdateAppDownloadLinksData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showLoadingState = async () => {
    setIsSubmit(true);
    console.log("Update App link", updateAppDownloadLinksData);

    try {
      // const {data, error} = await supabaseClient
      //   .from(E_DBTables.Apps)
      //   .update(updateAppDownloadLinksData)
      //   .eq('name', app.name)
      //   .select();

      await updateApp.mutateAsync({
        id: id as string,
        updates: updateAppDownloadLinksData
      });

      toast.success("App links updated successfully.");
    } catch (error) {
      console.error("Error updating download link", error.message);
      toast.error("Error updating download link. Try again soon.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <NavHeaderLink headerTitle="Update Download links"/>

      <ScrollView className="flex-1 bg-white dark:bg-[#111314]">
        <View className="space-y-8 p-4">
          <FormField>
            <LabelField text="Play Store">
              <TextInput
                className="h-16 px-5 bg-base-100 dark:bg-base native:rounded-2xl font-bold"
                placeholder="Playstore download link"
                defaultValue={app?.playstore_link}
                onChangeText={(value) => handleChange('playstore_link', value)}
                autoCapitalize="none"
                keyboardType="url"
              />
            </LabelField>
          </FormField>
          <FormField>
            <LabelField text="AppStore">
              <TextInput
                id="id-new-app-appstore-link"
                className="h-16 px-5 bg-base-100 dark:bg-base native:rounded-2xl font-bold"
                placeholder="AppStore download link"
                value={app.appstore_link}
                onChangeText={(value) => handleChange('appstore_link', value)}
                autoCapitalize="none"
                keyboardType="url"
              />
            </LabelField>
          </FormField>
          <FormField>
            <LabelField text="Other Store">
              <TextInput
                id="id-new-app-external-link"
                className="h-16 px-5 bg-base-100 dark:bg-base native:rounded-2xl font-bold"
                placeholder="Link to other Store download link"
                value={app.external_link}
                onChangeText={(value) => handleChange('external_link', value)}
                autoCapitalize="none"
                keyboardType="url"
              />
            </LabelField>
          </FormField>
        </View>
      </ScrollView>

      <View className="py-12">
        <Button
          onPress={showLoadingState}
          disabled={!(app?.playstore_link ||
            app?.appstore_link ||
            app?.external_link)}
          className="w-72 mx-auto rounded-xl bg-nine"
        >
          <Text>{isSubmit ? "Saving..." : "Save"}</Text>
        </Button>
      </View>
    </View>
  );
}
