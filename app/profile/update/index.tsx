import {ScrollView, View} from "react-native";
import {Text} from "~/components/ui/text";
import {NavHeaderLink} from "~/components/NavHeader";
import * as React from "react";
import {CardSectionContainer} from "~/components/PageSection";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {useUser} from "@clerk/clerk-expo";
import {PersonalDetailsSection} from "~/components/PersonalDetailsSection";
import {SocialProfileSection} from "~/components/SocialProfileSection";
import {useGetUserByUsername} from "~/hook/useNineUser";
import { useGetAppSocials } from "~/hook/useSocialList";

export default function ProfileUpdatePage() {
  const {user} = useUser();
  const {
    data: userDB,
    error: userError,
    isFetched: userFetched,
    isLoading: userLoading
  } = useGetUserByUsername(user?.username!);
  const {data: socialSitesList} = useGetAppSocials();

  return (
    <View className={"flex-auto gap-y-2"}>
      <NavHeaderLink headerTitle={"Update Profile"}/>

      <ScrollView className={"flex-1"}>
        <View className={"gap-y-2 px-2 py-2 bg-base-100 dark:bg-background"}>
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Change Display Picture"} linkUrl={`/profile/update/dp`}/>

            <View className={"px-4"}>
              <Avatar
                alt={user?.username!}
                className="w-32 h-32 rounded-full object-cover object-center"
              >
                <AvatarImage source={{uri: user?.imageUrl}}/>
                <AvatarFallback className={"bg-base-200"}>
                  <Text>{" "}</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </CardSectionContainer>

          {/* Basic Info */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Basic Info"} hideArrow={false} linkUrl={`/profile/update/basic-info`}/>

            <PersonalDetailsSection userData={userDB}/>
          </CardSectionContainer>

          {/* Social Profile */}
          <CardSectionContainer className={"border border-base-200"}>
            <SocialProfileSection userData={userDB} socialSitesList={socialSitesList!} linkUrl={"/profile/update/social-info"} />
          </CardSectionContainer>
        </View>
      </ScrollView>
    </View>
  )
}
