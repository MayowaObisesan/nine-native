import React, {useState} from "react";
import {ActivityIndicator, FlatList, StyleSheet, View} from "react-native";
import {SignedIn, SignedOut, useAuth, useUser} from "@clerk/clerk-expo";
import {useIsomorphicLayoutEffect} from "@rn-primitives/hooks";
import {getUserRepos} from "~/api/github";
import {toast} from "sonner-native";
import RepoCard from "./RepoCard";
import {Text} from "~/components/ui/text";
import {Button} from "~/components/ui/button";
import {Separator} from "~/components/ui/separator";
import {Input} from "~/components/ui/input";
import {E_DBTables} from "~/types/enums";
import {useNineContext} from "~/contexts";

const RepoSelectionScreen = ({onRepoSelect, selectedList, onSelectedList}: {
  onRepoSelect: (repo: any) => void;
  selectedList: any;
  onSelectedList: any
}) => {
  const {supabaseClient} = useNineContext();
  const [repos, setRepos] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const {isLoaded, isSignedIn, user} = useUser()
  // Use `useAuth()` to access the `getToken()` method
  const {getToken} = useAuth()

  useIsomorphicLayoutEffect(() => {
    async function fetchApps() {
      const {data, error} = await supabaseClient
        .from(E_DBTables.Apps)
        .select("*", {count: "exact", head: false})
        .eq("owner", user?.primaryEmailAddress?.emailAddress);

      if (error) {
        console.error("error fetching apps", error);
      }

      if (data && data.length > 0) {
        return data;
      }
    }

    async function _fetchUserRepos() {
      // Use `getToken()` to get the current session token
      // const token = await getToken()

      console.log("USername", user?.username);
      const response = await getUserRepos(user?.username!);
      const appsFromDB = await fetchApps();
      // Remove the repos you already have in the database
      setRepos(response.filter((repo: any) => !appsFromDB.some((app: any) => app.name === repo.name)));
      console.log("ue r repos")
    }

    if (isLoaded) {
      if (isSignedIn) {
        _fetchUserRepos();
      } else {
        console.log("User not signed in");
        toast.error("Kindly signin to proceed.");
      }
    }

    return () => {
    }
  }, [isLoaded])

  const filteredRepos = repos.length > 0 ? repos.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const MemoizedRepoCard = React.memo(RepoCard);

  /*
  * Avoid Arrow Functions in renderItem:
  * Define the renderItem function outside the render method to avoid re-creating the function on each render
  * */
  const renderItem = React.useCallback(({item, index}) => (
    <View>
      {index > 0 && <Separator className='mx-auto my-1.5 w-full'/>}
      <MemoizedRepoCard
        repo={item}
        onPress={() => onRepoSelect(item)}
        selectedList={selectedList}
        onSelectedList={onSelectedList}
      />
    </View>
  ), [onRepoSelect, selectedList, onSelectedList]);

  /*
  * Use getItemLayout:
  * This prop helps the FlatList to skip the measurement phase for improved performance.
  * */
  /*const getItemLayout = (data, index) => (
    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
  );*/

  /*
  * Use keyExtractor:
  * Ensure you provide a unique key for each item to help React identify which items have changed.
  * */
  const keyExtractor = (item) => item.id.toString();

  return (
    <View className={"flex-auto"}>
      <SignedIn>
        {/*<Text className={"font-bold text-lg px-2"}>Select a Repository:</Text>*/}

        <View className={"flex-auto gap-y-4 py-4"}>
          <View className={"px-4"}>
            <Input
              placeholder='Search...'
              value={query}
              onChangeText={setQuery}
              aria-labelledby='inputLabel'
              aria-errormessage='inputError'
              className={"native:h-12 placeholder:font-semibold font-Assistant px-6 rounded-xl border-0 bg-muted-foreground/10 focus:bg-muted-foreground/20 dark:bg-muted/40 dark:focus:bg-muted/80"}
            />
          </View>
          {
            filteredRepos
              ? <FlatList
                data={filteredRepos}
                keyExtractor={keyExtractor}
                // getItemLayout={getItemLayout}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                initialNumToRender={10} // Reduce from 50
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}  // helps to improve memory usage by removing items that are outside the viewport.
                fadingEdgeLength={20}
                ListEmptyComponent={
                  <Text className={"text-xl text-center mt-16 text-muted-foreground"}>No results found.</Text>
                }
              />
              : <ActivityIndicator size={"large"}/>
          }

          {/*<View className={"px-8"}>
            <Button size={"lg"} className={"bg-nine rounded-xl"}>
              <Text className={"font-bold text-nine-foreground"}>Submit</Text>
            </Button>
          </View>*/}
        </View>
      </SignedIn>
      <SignedOut>
        <Text className={"font-bold text-2xl"}>You need to sign in to view your repositories</Text>
      </SignedOut>
    </View>
  );
};

export default RepoSelectionScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
    gap: 5
  },
  messagesContainer: {
    // backgroundColor: "purple",
    // flexGrow: 1,
    paddingVertical: 10,
  },
})
