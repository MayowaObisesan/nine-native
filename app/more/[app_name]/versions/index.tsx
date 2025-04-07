import {FlatList, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {useGetGithubRepoBranches} from "~/hook/useGithub";
import {Text} from "~/components/ui/text";
import * as React from "react";
import {useEffect, useState} from "react";
import {Link, useGlobalSearchParams} from "expo-router";
import {useGetAppByName} from "~/hook/useApps";
import {getOwnerAndRepoFromUrl} from "~/lib/utils";
import BranchesCard from "~/components/cards/BranchesCard";

export default function LoadMoreBranchesPage() {
  const {app_name} = useGlobalSearchParams();

  const {
    data: app,
    isLoading: appLoading,
    error: appError
  } = useGetAppByName(app_name as string);

  const [page, setPage] = useState(1);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [owner, repo] = getOwnerAndRepoFromUrl(app?.github_repo);
  const {
    data: branches,
    isLoading,
    error
  } = useGetGithubRepoBranches(owner, repo || '', page);

  useEffect(() => {
    if (branches) {
      if (branches.length === 0) {
        setHasMore(false);
      } else {
        setAllBranches(prev => [...prev, ...branches]);
      }
    }
  }, [branches]);

  const renderItem = ({item}: { item: any }) => (
    <Link
      asChild
      key={item.url}
      id="id-app-versions"
      href={item?.commit?.url || ""}
      className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}
    >
      <View className="leading-tight">
        <Text className={"text-base font-bold underline underline-offset-2"}>
          {item?.name}
        </Text>
      </View>
    </Link>
  );

  const loadMoreFollowers = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading branches...</Text>
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
      <NavHeaderLink headerTitle="Branches"/>

      <BranchesCard version={allBranches} app={app} />

      {/*<FlatList
        data={allBranches}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
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
      />*/}
    </View>
  );
}
