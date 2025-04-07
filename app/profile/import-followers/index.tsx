import {FlatList, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {useGetGithubFollowers} from "~/hook/useGithub";
import {ImportFromGithubUserCard} from "~/components/cards/UserCard";
import {Text} from "~/components/ui/text";
import {useUser} from "@clerk/clerk-expo";
import {Separator} from "~/components/ui/separator";
import {useEffect, useState} from "react";

export default function ImportFollowers() {
  const {user} = useUser();
  const [page, setPage] = useState(1);
  const [allFollowers, setAllFollowers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: followers,
    isLoading,
    error
  } = useGetGithubFollowers(user?.username || '', page);

  useEffect(() => {
    if (followers) {
      if (followers.length === 0) {
        setHasMore(false);
      } else {
        setAllFollowers(prev => [...prev, ...followers]);
      }
    }
  }, [followers]);

  const renderItem = ({item}: { item: any }) => (
    <ImportFromGithubUserCard user={item}/>
  );

  const loadMoreFollowers = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading followers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading followers: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Import followers from GitHub"/>

      <FlatList
        data={allFollowers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text>No followers found</Text>
          </View>
        }
        // ItemSeparatorComponent={() => <Separator/>}
        contentContainerClassName={"px-2"}
        onEndReached={loadMoreFollowers}
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
