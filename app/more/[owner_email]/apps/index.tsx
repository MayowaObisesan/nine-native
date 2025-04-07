import {FlatList, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {Text} from "~/components/ui/text";
import * as React from "react";
import {useEffect, useState} from "react";
import {useGlobalSearchParams} from "expo-router";
import {useGetUserApps} from "~/hook/useApps";
import {ListAppCard} from "~/components/cards/AppCard";

export default function LoadMoreAppsPage() {
  const {owner_email} = useGlobalSearchParams();
  console.log(owner_email);

  const [page, setPage] = useState(1);
  const [allApps, setAllApps] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: userApps,
    isLoading,
    error
  } = useGetUserApps(owner_email as string, page);

  useEffect(() => {
    if (userApps) {
      if (userApps.length === 0) {
        setHasMore(false);
      } else {
        setAllApps(prev => [...prev, ...userApps]);
      }
    }
  }, [userApps]);

  const renderItem = ({item}: { item: any }) => (
    <ListAppCard app={item}/>
  );

  const loadMoreApps = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading projects: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Projects"/>

      <FlatList
        data={allApps}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text>No projects found</Text>
          </View>
        }
        // ItemSeparatorComponent={() => <Separator/>}
        contentContainerClassName={"gap-y-6 px-2 py-2"}
        onEndReached={loadMoreApps}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View className="p-4">
              <Text>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
