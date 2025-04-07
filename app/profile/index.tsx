import {View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {Link} from "expo-router";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {LucidePencil} from "lucide-react-native";
import {SignedIn, useUser} from "@clerk/clerk-expo";
import * as React from "react";
import {Suspense} from "react";
import ProfilePageSkeleton from "~/components/skeletons/profilePage";
import UserPageComponent from "~/components/UserPageComponent";

export default function Profile() {
  const {user, isLoaded} = useUser();

  return (
    <Suspense fallback={<ProfilePageSkeleton/>}>
      <View className={"flex-1"}>
        <NavHeaderLink headerTitle={"My Profile"}>
          <SignedIn>
            <Link
              asChild
              href={"/profile/update"}
              className={"flex flex-row gap-x-2 absolute right-4 h-10 leading-10 rounded-2xl px-4 decoration-none"}
            >
              <Button variant={"default"} className={"bg-nine"}>
                <Text className={"font-bold"}>Edit</Text>
                <LucidePencil size={16} fill={"white"} color={"transparent"} strokeWidth={2}/>
              </Button>
            </Link>
          </SignedIn>
        </NavHeaderLink>

        <UserPageComponent username={user?.username!}/>
        {/*<UserPageComponentOld userId={user?.id!} userData={userDB}/>*/}
      </View>
    </Suspense>
  )
}
