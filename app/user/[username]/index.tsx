import {View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {useLocalSearchParams} from "expo-router";
import * as React from "react";
import {Suspense} from "react";
import ProfilePageSkeleton from "~/components/skeletons/profilePage";
import UserPageComponent from "~/components/UserPageComponent";

export default function UserPage() {
  const {username} = useLocalSearchParams();

  return (
    <Suspense fallback={<ProfilePageSkeleton/>}>
      <View className={"flex-1"}>
        <NavHeaderLink headerTitle={`Profile`}/>

        <UserPageComponent username={username as string}/>
      </View>
    </Suspense>
  )
}
