import {ScrollView, View} from "react-native";
import {Text} from "~/components/ui/text";
import {LucideStar} from "lucide-react-native";
import {MiniBasicGridAppBoxes} from "~/components/cards/AppCard";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {Link} from "expo-router";
import {PersonalDetailsSection} from "~/components/PersonalDetailsSection";
import {AppsSection} from "~/components/AppsSection";
import {SocialProfileSection} from "~/components/SocialProfileSection";
import * as React from "react";
import {useGetUserByUsername} from "~/hook/useNineUser";
import {useGetUserApps} from "~/hook/useApps";
import {useGetAppSocials} from "~/hook/useSocialList";
import {useUserTimeline} from "~/hook/useTimeline";
import {BRAND_COLOR_MAP} from "~/lib/constants";
import {ProfileBasicSocialListCard} from "~/components/ProfileBasicSocialListCard";
import {Button} from "~/components/ui/button";
import {useUser} from "@clerk/clerk-expo";

export default function UserPageComponent({username}: { username: string }) {
  const {user: myUser} = useUser();
  const {
    data: user,
    error: userError,
    isFetched: userFetched,
    isLoading: userLoading
  } = useGetUserByUsername(username);
  const userId = user?.id;
  const {
    data: userApps,
    error: userAppsError,
    isLoading: userAppsLoading,
    isFetched: userAppsFetched
  } = useGetUserApps(user?.email!);
  const {data: socialSitesList} = useGetAppSocials();
  const {data: userTimelineData, isLoading, error, refetch} = useUserTimeline(userId!);

  return (
    <ScrollView className={"flex-1"}>
      {/* The Profile banner container */}
      <View className={"flex-1 gap-y-4"}>
        <View className={"w-full h-[480px] bg-muted/60"}>
          {/* The Profile banner */}
          <View className={"h-[280px] b-green-100/80 opacity-20"}>
            {/* The dynamic profile banner cover */}
            <View
              className={"relative h-full flex flex-row justify-end items-start flex-wrap w-full py-1 b-blue-300"}>
              <View className={"gap-y-1 b-gray-900 w-2/5 px-2"}>
                <View className={"w-full h-3/5 gap-y-1 b-pink-600"}>
                  <Text className={"px-2"}>Languages:</Text>
                  <View className={"gap-1 b-orange-400"}>
                    {
                      "python,javascript,typescript,rust".split(",").map((userProgLang) => (
                        <View
                          key={userProgLang}
                          className="flex flex-row items-center gap-x-2 py-1.5 px-3 rounded-full text-sm font-medium text-blue-800 dark:text-blue-500"
                        >
                          <View
                            className="w-1.5 h-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></View>
                          <Text className={"font-medium text-sm text-muted-foreground"}>{userProgLang}</Text>
                        </View>
                      ))
                    }
                  </View>
                </View>

                <View className={"h-2/5 gap-y-1 px-2"}>
                  <Text>Stars</Text>
                  <View className={"flex-row items-center gap-x-2"}>
                    <LucideStar size={14} color={"gold"} fill={"gold"}/>
                    <Text className={"font-bold"}>45</Text>
                  </View>
                </View>
              </View>

              <View className={"w-3/5 h-3/5 flex-row flex-wrap justify-end gap-y-2"}>
                {
                  userApps?.slice(0, 1).map((eachApp, index) => (
                    <View key={eachApp.name}
                          className={"relative w-32 h-full rotate-0 pointer-events-none select-none"}>
                      <MiniBasicGridAppBoxes {...eachApp} />
                    </View>
                  ))
                }
                {
                  userApps?.slice(1, 2).map((eachApp, index) => (
                    <View key={eachApp.name}
                          className={"relative w-32 h-full rotate-0 pointer-events-none select-none"}>
                      <MiniBasicGridAppBoxes {...eachApp} />
                    </View>
                  ))
                }
                {
                  userApps?.slice(2, 3).map((eachApp, index) => (
                    <View key={eachApp.name}
                          className={"relative w-32 h-full rotate-0 pointer-events-none select-none"}>
                      <MiniBasicGridAppBoxes {...eachApp} />
                    </View>
                  ))
                }
              </View>
            </View>
          </View>

          <View
            className={"flex flex-col justify-start items-center flex-1 gap-y-4 b-fuchsia-700/40 bg-background/80 native:backdrop-blur-2xl"}>
            {/* The profile basic info */}
            <Avatar
              alt={"profile picture"}
              className="mx-4 -mt-16 w-32 h-32 border-4 border-base-300 rounded-full radius-circle object-cover object-center"
            >
              <AvatarImage source={{uri: user?.dp}}/>
              <AvatarFallback className={"bg-base-200"}>
                <Text
                  className={"font-bold text-2xl"}
                >
                  {user?.firstname && user?.firstname![0]?.toLocaleUpperCase() + user?.lastname![0]?.toLocaleUpperCase()}
                </Text>
              </AvatarFallback>
            </Avatar>

            <View className={""}>
              <Text className={"font-bold px-4 py-1 text-center text-4xl md:text-6xl md:text-left"}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text className={"font-medium pb-3 text-center text-xl md:text-xl md:text-left text-muted-foreground"}>
                @ {user?.username}
              </Text>
              <View className={"flex flex-col items-center gap-y-3 py-1"}>
                <View className={"flex flex-col items-center gap-3"}>
                  {/*<View className={"relative text-xl leading-normal font-15"}>
                    <Link
                      href={`mailto: ${user?.email}`}
                      className={"underline text-center"}
                    >
                      {user?.email}
                    </Link>
                  </View>*/}
                  {/*<View className={"relative text-xl leading-normal font-semibold"}>
                    <Link
                      href={`tel: ${user?.phone_no}`}
                      className={"font-normal md:font-normal underline"}
                    >
                      {getFormattedPhoneNumber(user)}
                    </Link>
                  </View>*/}
                  <ProfileBasicSocialListCard
                    userData={user}
                    socialSitesList={socialSitesList}
                    brandColorMap={BRAND_COLOR_MAP}
                  />
                </View>

                {/*{
                          size.windowWidth < deviceWidthEnum.tablet
                            ? <div className={"flex flex-col items-center gap-y-3"}>
                              <div className={"relative text-xl leading-normal font-15"}>
                                <a href={`mailto: ${userDB?.email}`}
                                   className={"hover:underline"}>{userDB?.email}</a>
                              </div>
                              <div className={"relative text-xl leading-normal font-semibold"}>
                                <a href={`tel: ${userDB?.phone_no}`}
                                   className={"font-semibold md:font-normal hover:underline"}>{userDB?.phone_no}</a>
                              </div>
                            </div>
                            : <>
                              <ListContentContainer
                                icon={<span className={"fa fa-message"}></span>}
                                classes={"hover:underline rounded-2xl"}
                                body={<a href={`mailto: ${userDB?.email}`}>{userDB?.email}</a>}
                              />
                              <ListContentContainer
                                icon={<span className={"fa fa-mobile"}></span>}
                                classes={"hover:underline rounded-2xl"}
                                body={<a href={`tel: ${userDB?.phone_no}`}
                                         className={"font-semibold md:font-normal"}>{userDB?.phone_no}</a>}
                              />
                            </>
                        }*/}
              </View>

              {
                user?.tags
                && <View className={"relative block text-left my-2 lg:my-2"}>
                  {
                    "python, javascript, golang".split(",").map((each_user_skills, index) => {
                      return (
                        <View
                          key={index}
                          className={"bg-light radius p-2 mx-4 lg:text-lg lg:font-13"}
                        >
                          <Text>{each_user_skills}</Text>
                        </View>
                      )
                    })
                  }
                  </View>
              }
            </View>
          </View>
        </View>

        {
          myUser?.primaryEmailAddress?.emailAddress === user?.email
          && <View>
                <Button
                    className={"w-4/6 mx-auto"}
                >
                    <Link
                        href={"/profile/import-followers"}
                    >
                        <Text>Import your Followers from Github</Text>
                    </Link>
                </Button>
            </View>
        }

        {/* Personal Details section */}
        <View className={""}>
          <PersonalDetailsSection userData={user}/>
        </View>

        {/* Your Apps section */}
        <View>
          <AppsSection
            userData={user}
            userApps={userApps}
            userId={userId!}
            linkUrl={userId === user?.id ? `/more/${user?.email}/apps` : "apps"}
            headerTitle={userId === user?.id ? "Your Apps" : `${user?.firstname} Apps`}
          />
        </View>

        <View>
          <SocialProfileSection userData={user} socialSitesList={socialSitesList!}/>
        </View>
      </View>
    </ScrollView>
  )
}
