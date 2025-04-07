import {NavHeaderLink} from "~/components/NavHeader";
import {Link, router, useLocalSearchParams} from "expo-router";
import {Text} from "~/components/ui/text";
import {LucideInfo, LucidePlus, LucideSettings, LucideTrash} from "lucide-react-native";
import * as React from "react";
import {ReactElement, useEffect, useState} from "react";
import {useColorScheme} from "~/lib/useColorScheme";
import {Pressable, ScrollView, View} from "react-native";
import {useGetAppByName, useGetUserApps} from "~/hook/useApps";
import {useSession} from "@clerk/clerk-expo";
import {useGetUserByEmail} from "~/hook/useNineUser";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {LUCIDE_ICON_THEME_COLOR} from "~/lib/constants";
import {capitalize, getExternalLinkDomain, truncateLetters} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {getRepoBranches} from "~/api/github";
import {CardSectionContainer} from "~/components/PageSection";

export default function AppsUpdatePage() {
  const {colorScheme} = useColorScheme();
  const {id} = useLocalSearchParams();
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const {session} = useSession();
  const [repoBranches, setRepoBranches] = useState([]);
  const {
    data: user,
    error: userError,
    isFetched: userFetched,
    isLoading: userLoading
  } = useGetUserByEmail(app?.owner);
  const {
    data: userApps,
    error: userAppsError,
    isLoading: userAppsLoading,
    isFetched: userAppsFetched
  } = useGetUserApps(app?.owner);

  // Add this useEffect to fetch repo branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      if (app?.github_repo) {
        const [owner, repo] = new URL(app.github_repo).pathname.replace("/", "").split("/");
        const data = await getRepoBranches(owner, repo);
        setRepoBranches(data || []);
      }
    };
    fetchBranches();
  }, [app?.github_repo]);

  return (
    <View className={"flex-auto gap-y-2"}>
      <NavHeaderLink headerTitle={"Update " + app?.name}/>

      <View className={"px-2"}>
        <Alert icon={LucideInfo} className='max-w-xl border-0 bg-warning rounded-xl'>
          <AlertTitle className={"font-black"}>Heads up!</AlertTitle>
          <AlertDescription className={"text-lg"}>
            Click on any to arrows to update.
          </AlertDescription>
        </Alert>
      </View>

      <ScrollView className={"flex-1"}>
        <View className={"gap-y-2 px-2 py-2 bg-base-100 dark:bg-background"}>
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Change App Logo"} linkUrl={`/app/${id}/update/logo`}/>

            <View className={"px-4"}>
              <Avatar
                alt={app?.name?.toString()!}
                className="w-32 h-32 rounded-full object-cover object-center"
              >
                <AvatarImage source={{uri: app?.logo}}/>
                <AvatarFallback className={"bg-base-200"}>
                  <Text>{" "}</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </CardSectionContainer>

          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Update Screenshots"} linkUrl={`/app/${id}/update/screenshots`}/>

            <View className={"px-2"}>
              {
                app?.screenshots
                  ? (
                    <ScrollView horizontal className={"flex flex-row gap-x-0.5"}>
                      {Object.values(app?.screenshots || {}).map((screenshot, index) => (
                        <View key={index} className={"px-4"}>
                          <View className={"w-44 max-w-44"}>
                            <Avatar alt={""} className="w-full h-60 rounded-2xl object-cover object-center">
                              <AvatarImage source={{uri: screenshot}} className={"rounded-none"}/>
                              <AvatarFallback className={"rounded-none bg-base-200"}>
                                <Text>{""}</Text>
                              </AvatarFallback>
                            </Avatar>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  )
                  : (
                    <View
                      className={"flex flex-col justify-center items-center gap-6 lg:gap-8 w-[96%] h-[160px] pct:w-96 h-160 border:2px_dashed_DDD mx-auto mt-4 rounded-xl radius color-BBB dark:border:2px_dashed_darkgray"}>
                      <LucidePlus size={32} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>
                      <Text className={"text-xl"}>Select images to upload</Text>
                    </View>
                  )
              }
            </View>
          </CardSectionContainer>

          {/* Basic Info */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Basic Info"} hideArrow={false} linkUrl={`/app/${id}/update/basic-info`}/>

            <View className="gap-y-5 px-4">
              <View
                className="relative gap-y-2 px-4 py-2 font-13 bg-white-solid lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
                <Text className={"h4 lh-4 lg:font-12"}>App name:</Text>
                <Text className="font-bold text-2xl">{app?.name ? capitalize(app.name) : ""}</Text>
              </View>
              <View
                className="relative gap-y-2 px-4 py-2 bg-white-solid text-md font-13 lg:font-13|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
                <Text className={"h4 lh-4 lg:font-12"}>Description:</Text>
                <Text
                  className={"text-lg"}>{app.truncate_description ? truncateLetters(app.description, 0, 160) : app.description}</Text>
              </View>
              <View
                className="relative gap-y-2 px-4 py-2 bg-white-solid font-13 lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
                <Text className={"h4 lh-4 lg:font-12"}>Version:</Text>
                <Text className={"kbd kbd-lg"}>{app.version || "-"}</Text>
              </View>
              <View
                className="relative gap-y-2 px-4 py-2 bg-white-solid font-13 lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
                <Text className={"h4 lh-4 lg:font-12"}>Website:</Text>
                <Text className={"text-lg font-medium"}>{app.website || "-"}</Text>
              </View>
            </View>
          </CardSectionContainer>

          {/* App category */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Category"} linkUrl={`/app/${id}/update/category`}/>
            <View className="flex flex-col gap-y-4 px-2 lg:px-4 overflow-x-auto">
              {
                app.category
                  ? app.category?.split(',').map((each_app_category, index) => (
                    <View
                      key={index}
                      className="justify-center px-4 h-14 leading-[48px] mx-1.5 rounded-xl radius bg-base-100 bg-light font-normal font-12 lg:text-lg lg:h-16 lg:leading-[64px] lg:my-2 lg:font-14|h-8|lh-8|mg-y1-sm dark:bg-333435|color-darkgray">
                      <Text className="text-sm font-medium">{each_app_category.trim()}</Text>
                    </View>
                  ))
                  : <Text className={"text-center p-8"}>Select a category for this app</Text>
              }
            </View>
          </CardSectionContainer>

          {/* App download links */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"Download links"} linkUrl={`/app/${id}/update/download-links`}/>

            <View
              className={"flex flex-col gap-5 px-5 every:d-block|decoration-none|pad-x2|pad-y3"}>
              <Link
                asChild
                href={app.playstore_link || ""}
                className={"flex flex-row items-center gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-100 px-5 pr-8 hover:bg-base-300 dark:bg-base-200 dark:hover:bg-base-300"}
              >
                <View>
                  <Avatar
                    alt={app?.name?.toString()!}
                    className="w-6 h-6 rounded-md object-cover object-center"
                  >
                    <AvatarImage source={require('~/assets/images/playstore.png')}/>
                    <AvatarFallback className={"bg-muted-foreground"}>
                      <Text>AS</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Text className={""}>
                    {app.playstore_link ? "Download from Google play store" : "-"}
                  </Text>
                </View>
              </Link>

              <Link
                asChild
                href={app.appstore_link || ""}
                className={"flex-row items-center gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-100 px-5 pr-8 hover:bg-base-300 dark:bg-base-200 dark:hover:bg-base-300"}
              >
                <View>
                  <Avatar
                    alt={app?.name?.toString()!}
                    className="w-6 h-6 rounded-md object-cover object-center"
                  >
                    <AvatarImage source={require('~/assets/images/appstore.png')}/>
                    <AvatarFallback className={"bg-muted-foreground"}>
                      <Text>AS</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Text className={""}>
                    {app.appstore_link ? "Download from Apple AppStore" : "-"}
                  </Text>
                </View>
              </Link>

              <Link
                asChild
                href={app.external_link || ""}
                className={"flex-row items-center gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-100 px-5 pr-8 hover:bg-base-300 dark:bg-base-200 dark:hover:bg-base-300"}
              >
                <View>
                  <Avatar
                    alt={app?.name?.toString()!}
                    className="w-6 h-6 rounded-md object-cover object-center"
                  >
                    <AvatarImage source={require('~/assets/images/icon-default.png')}/>
                    <AvatarFallback className={"bg-muted-foreground"}>
                      <Text>{" "}</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Text className={""}>{getExternalLinkDomain(app?.external_link)}</Text>
                </View>
              </Link>
            </View>
          </CardSectionContainer>

          {/* App versions */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink
              headerTitle={"App Versions"}
              linkUrl={`/app/${id}/update/versions`}
            />
            <View className={"space-y-2 px-2 lg:px-4 every:d-block|pad-2"}>
              {
                repoBranches?.slice(0, 4).map((eachAppVersion, index) => (
                  <Link
                    asChild
                    key={index} id="id-app-versions"
                    href={eachAppVersion?.commit?.url}
                    className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}
                  >
                    <View className="leading-tight">
                      <Text className={"text-base font-bold underline underline-offset-2"}>
                        {eachAppVersion?.name}
                        {/*release on {new Date(eachAppVersion?.release_date).toLocaleDateString()}*/}
                      </Text>
                      {/*<Text className={"text-[15px]"}>
                        {truncateLetters(eachAppVersion?.latest_feature, 0, 70)}
                      </Text>*/}
                    </View>
                    {/*<Text
                      className="w-12 h-12 leading-[48px] square-6 lh-6 text-base font-bold font-18 color-444 dark:color-darkgray">
                      {eachAppVersion?.version}
                    </Text>*/}
                  </Link>
                ))
              }
              <View
                id="id-app-download-links"
                className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}
              >
                <Button size={"lg"} className={"w-full bg-nine rounded-2xl"}>
                  <Text className={"font-semibold text-sm"}>Show all</Text>
                </Button>
              </View>
            </View>
          </CardSectionContainer>

          {/* App Management */}
          <CardSectionContainer className={"border border-base-200"}>
            <CardHeaderLink headerTitle={"App management"} hideArrow={true} linkUrl={""}/>
            <View className={"gap-y-4 px-4"}>
              <View id="id-app-download-links"
                    className={"flex flex-row items-center gap-x-4 p-4 color-lightgray dark:color-333435"}>
                {/*<span className="fa fa-gear w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-lightgray dark:color-333435"></span>*/}
                <LucideSettings color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>
                <Text className={"lg:text-lg"}>{"Settings"}</Text>
              </View>
              {/*<View id="id-app-download-links"
                      className={"flex flex-row items-center p-4 color-lightgray dark:color-333435"}>
                  <span className="fa fa-hammer w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-lightgray dark:color-333435"></span>
                  <div className={"lg:text-lg"}>{"Under construction"}</div>
                </View>*/}
              <View>
                <Pressable
                  onPress={() => {
                    router.push(`/app/${id}/delete`)
                  }}
                  className={"flex flex-row items-center gap-x-4 p-4 decoration-none"}
                >
                  {/*<span className="fa fa-trash w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18"></span>*/}
                  <LucideTrash color={"red"}/>
                  <Text className={"font-bold text-error lg:text-lg"}>{"Delete"} {app.name}</Text>
                </Pressable>
              </View>
            </View>
          </CardSectionContainer>
        </View>
      </ScrollView>
    </View>
  )
}
