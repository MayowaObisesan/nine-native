import {useGetUserApps} from "~/hook/useApps";
import {Text} from "~/components/ui/text";
import React, {useState} from "react";
import {router} from "expo-router";
import {Pressable, StyleSheet, View} from "react-native";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {Button} from "~/components/ui/button";
import {useFollowUser, useIsFollowingUser} from "~/hook/useNineUser";
import {SignedIn, useUser} from "@clerk/clerk-expo";
import {toast} from "sonner-native";
import {LoadingButton} from "~/components/LoadingButton";

const TotalApps = ({user}: { user: any }) => {
  const {
    data: userApps,
    error: userAppsError,
    isLoading: userAppsLoading
  } = useGetUserApps(user?.email);

  if (userAppsError) {
    return (
      <Text>..</Text>
    )
  }

  if (userAppsLoading) {
    return (
      <Text>...</Text>
    )
  }

  return (
    <Text>{userApps?.length} projects</Text>
  )
}

export function UserCard({user}: { user: any }) {
  const {user: me} = useUser();
  const followUser = useFollowUser();
  const {data: isFollowingUser} = useIsFollowingUser(
    me?.primaryEmailAddress?.emailAddress!,
    user?.email,
  );
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

  async function handleFollow() {
    setIsFollowLoading(true);

    try {
      await followUser.mutateAsync({
        followed_user: user?.email,
        follower: me?.primaryEmailAddress?.emailAddress,
      });

      toast.success("You are now following " + user?.firstname);
    } catch (e) {
      console.error(e);
      toast.error("Error following " + user?.firstname);
    } finally {
      setIsFollowLoading(false);
    }
  }

  return (
    <Pressable
      className={"flex flex-row justify-between items-center px-2 py-4"}
      onPress={() => router.push(`/user/${user.username}`)}
    >
      <View className={"flex flex-row items-center gap-4"}>
        <Avatar alt={""} className="w-12 h-12 rounded-full">
          <AvatarImage source={{uri: user?.dp}}/>
          <AvatarFallback>
            <Text className={"font-bold"}>{user.firstname[0]}</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text style={styles.itemText}>{user.firstname} {user.lastname}</Text>
          <TotalApps user={user}/>
        </View>
      </View>
      <SignedIn>
        {
          me?.primaryEmailAddress?.emailAddress !== user?.email &&
          isFollowingUser?.count! === 0 &&
            <Button onPress={handleFollow} size={"sm"} className={"rounded-xl"}>
              {isFollowLoading ? <LoadingButton text={""}/> : <Text>Follow</Text>}
            </Button>
        }
      </SignedIn>
    </Pressable>
  )
}

export function ImportFromGithubUserCard({user}: { user: any }) {
  function sendJoinInvite() {
    // Implement send email functionality.

  }

  return (
    <View
      className={"flex flex-row justify-between items-center px-2 py-4"}
    >
      <View className={"flex flex-row items-center gap-4"}>
        <Avatar alt={""} className="w-12 h-12 rounded-full">
          <AvatarImage source={{uri: user?.avatar_url}}/>
          <AvatarFallback>
            <Text className={"font-bold"}>{user.login[0]}</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text style={styles.itemText}>{user.login}</Text>
          <TotalApps user={user}/>
        </View>
      </View>
      <Button size={"sm"} className={"rounded-xl"} onPress={sendJoinInvite}>
        <Text>Invite</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // backgroundColor: '#ffffff',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#999999',
  },
});
