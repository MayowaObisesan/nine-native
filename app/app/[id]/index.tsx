// components/ui/category-list.tsx
import {Pressable, ScrollView, View} from "react-native";
import {Image} from 'expo-image';
import {Text} from "~/components/ui/text";
import {Link, useLocalSearchParams} from "expo-router";
import {Button} from "~/components/ui/button";
import ParallaxScrollView from "~/components/ParallaxScrollView";
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {NavHeaderLink} from "~/components/NavHeader";
import {
  AlertTriangle,
  LucideChevronRight,
  LucideMail,
  LucideMapPin,
  LucidePencil,
  LucidePhone
} from "lucide-react-native";
import {useGetAppByName, useGetUserApps, useIsSubscribedToApp, useSubscribeToApp} from "~/hook/useApps";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {
  capitalize,
  convertLanguageData,
  formattedDate,
  getExternalLinkDomain,
  getFormattedPhoneNumber,
  truncateLetters
} from "~/lib/utils";
import Markdown from "react-native-markdown-display";
import {getRepoBranches, getRepoCollaborators, getRepoLanguages} from "~/api/github";
import {Separator} from "~/components/ui/separator";
import {SignedIn, useSession} from "@clerk/clerk-expo";
import {useGetUserByEmail} from "~/hook/useNineUser";
import {useColorScheme} from "~/lib/useColorScheme";
import {BLUR_HASH, LUCIDE_ICON_THEME_COLOR, PROGRAMMING_LANGUAGE_ICONS} from "~/lib/constants";
import {BasicGridAppBoxes} from "~/components/cards/AppCard";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {CardSectionBody, CardSectionContainer} from "~/components/PageSection";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import AppPageSkeleton from "~/components/skeletons/appPage";
import {useGetGithubRepo} from "~/hook/useGithub";
import BranchesCard from "~/components/cards/BranchesCard";
import {toast} from "sonner-native";
import {LoadingButton} from "~/components/LoadingButton";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import {useNineContext} from "~/contexts";

// Modify the AppScreenshots component
function AppScreenshots({screenshots}: { screenshots: any }) {
  // Sample data - replace with your actual screenshots data
  // const screenshots = [{key: 'a'}, {key: 'b'}];

  return (
    <ScrollView horizontal className={"flex flex-row gap-x-0.5"}>
      {Object.values(screenshots || {}).map((screenshot, index) => (
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
  );
}

interface CategoryListProps {
  categories: string;
  className?: string;
}

export function CategoryList({categories, className}: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`px-6 py-4 rounded-xl ${className}`}
    >
      {categories.split(',').map((category, index) => (
        <View
          key={index}
          className="flex-row items-center px-4 h-10 mx-1 rounded-xl bg-base-100"
        >
          <Text className="text-sm font-medium">
            {category.trim()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function SubscribeButton({app, user}: { app: any, user: any }) {
  const {session} = useSession();

  // Subscribe actions
  const subscribeUser = useSubscribeToApp();
  const {data: isSubscribedToApp} = useIsSubscribedToApp(
    app?.id,
    session?.user?.primaryEmailAddress?.emailAddress!,
  );
  const [isSubscribeLoading, setIsSubscribeLoading] = useState<boolean>(false);

  async function handleSubscribe() {
    setIsSubscribeLoading(true);

    try {
      await subscribeUser.mutateAsync({
        app_id: app?.id,
        subscriber_email: session?.user?.primaryEmailAddress?.emailAddress,
      });

      toast.success("You are now subscribed to " + app?.name);
    } catch (e) {
      toast.error("Error subscribing to " + app?.name);
    } finally {
      setIsSubscribeLoading(false);
    }
  }

  return (
    <View className={"items-center"}>
      <View className={""}>
        {
          session?.user?.primaryEmailAddress?.emailAddress === app?.owner &&
          isSubscribedToApp?.count === 0
            ? <Button
                size={"sm"}
                variant={"ghost"}
                className={"flex-row gap-x-2.5 px-4 rounded-2xl h-14 bg-base-200"}
                onPress={handleSubscribe}
                disabled={isSubscribeLoading}
            >
              {
                isSubscribeLoading
                  ? <LoadingButton text={""} color={"#222222"}/>
                  : <>
                    <Text>Subscribe</Text>
                    <FontAwesomeIcon icon={"bell"} size={18}/>
                  </>
              }
            </Button>
            : <Button
              size={"sm"}
              variant={"ghost"}
              className={"flex-row gap-x-2.5 px-4 rounded-2xl h-14 bg-error"}
              onPress={handleSubscribe}
              disabled={isSubscribeLoading}
            >
              {
                isSubscribeLoading
                  ? <LoadingButton text={""} color={"#222222"}/>
                  : <>
                    <Text className={"text-white"}>Unsubscribe</Text>
                    <FontAwesomeIcon icon={"bell-slash"} size={18} color={"white"}/>
                  </>
              }
            </Button>
        }
      </View>
    </View>
  )
}

/*
* TODO: March 2, 2025. Allow posting your progress from Nine to your social media sites that you have connected.
*   Twitter, LinkedIn, Facebook, Instagram, GitHub, GitLab, Bitbucket, etc. Without you having to manually
*   make a post everytime you are busy working so people can see what you're doing. It is a lot of work having to switch
*   between work and social media to post your progress. It is distracting for me and to me. This will fix that issue
*   for me and for other developers in the same boat.
*  */

export default function AppDetailsPage() {
  const {scheduleNotification} = useNineContext();
  const {colorScheme} = useColorScheme();
  const {id} = useLocalSearchParams()
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const [collaborators, setCollaborators] = useState([]);
  const [languages, setLanguages] = useState([]);
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
  const {data: userRepo} = useGetGithubRepo(app?.owner, app?.name);

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

    const fetchCollaborators = async () => {
      if (app?.github_repo) {
        const [owner, repo] = new URL(app.github_repo).pathname.replace("/", "").split("/");
        const data = await getRepoCollaborators(owner, repo);
        setCollaborators(data || []);
      }
    };
    fetchCollaborators();

    const fetchRepoLanguages = async () => {
      if (app?.github_repo) {
        const [owner, repo] = new URL(app.github_repo).pathname.replace("/", "").split("/");
        const data = await getRepoLanguages("", owner, repo);
        setLanguages(data || []);
      }
    }
    fetchRepoLanguages();
  }, [app?.github_repo]);

  function OwnerContact() {
    if (userLoading || !userFetched) {
      return <Text>Loading Owner Details...</Text>
    }

    return (
      <View className={"gap-y-2 every:decoration-none|color-initial dark:every:color-whitesmoke"}>
        <Link
          asChild
          href={app.owner === session?.user.primaryEmailAddress?.emailAddress ? "/profile" : `/user/${user?.username}`}
          className="flex flex-row justify-start items-center gap-x-4 p-4 my-1 decoration-none color-initial rounded-3xl bg-base-100 hover:bg-base-200 lg:bg-base-200 hover:bg-lighter dark:hover:bg-base-300"
        >
          {/* <img src={app.owner.dp} alt="" width={"48"} height={"48"}
            className="square-6 lh-6 radius-circle bg-lighter dark:bg-222324" /> */}
          {/*<Avatar
            src={app.owner.dp}
            alt={""}
            type={"rounded-full"}
            classes={"w-12 bg-base-300"}
          >
            <span className={"font-bold"}>
              {app.owner.firstname && app.owner.firstname[0].toUpperCase()}
              {app.owner.lastname && app.owner.lastname[0].toUpperCase()}
            </span>
          </Avatar>*/}
          <View>
            <Avatar
              alt={app?.name?.toString()!}
              className="w-16 h-16 rounded-full object-cover object-center bg-base-300"
            >
              <AvatarImage source={{uri: user?.dp}}/>
              <AvatarFallback className={"bg-muted-foreground"}>
                <Text>{user?.firstname[0]}{user.lastname[0]}</Text>
              </AvatarFallback>
            </Avatar>
            <Text className="font-medium">{user?.firstname} {user?.lastname}</Text>
          </View>
        </Link>
        <Link
          asChild
          href={`mailto:${user?.email}`}
          id="id-app-owner-email"
          className="flex-row gap-x-4 pl-10 pr-4 py-4 rounded-2xl radius hover:bg-base-200 hover:decoration-2 hover:underline-offset-2 hover:underline dark:hover:bg-base-300"
        >
          {/*<span className="fa fa-envelope w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>*/}
          <View>
            <LucideMail size={20} strokeWidth={2} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}
                        className={"pr-2 text-base-content"}/>
            <Text className={"px-2 font-semibold underline"}>{user?.email}</Text>
          </View>
        </Link>
        <Link
          asChild
          href={`tel:${user?.phone_no}`} id="id-app-owner-email"
          className="flex-row gap-x-4 pl-10 pr-4 py-4 rounded-2xl radius hover:bg-base-200 hover:decoration-2 hover:underline-offset-2 hover:underline dark:hover:bg-base-300">
          {/*<span className="fa fa-phone w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>*/}
          <View>
            <LucidePhone size={20} strokeWidth={2} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}
                         className={"w-8 h-8 leading-8 pr-2 text-base-content"}/>
            <Text className={"px-2 underline"}>{getFormattedPhoneNumber(user) || "-"}</Text>
          </View>
        </Link>
        <View id="id-app-owner-email" className="flex-row gap-x-4 pl-10 pr-4 py-4">
          {/*<span className="fa fa-earth-africa w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>*/}
          <LucideMapPin size={20} strokeWidth={2} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}
                        className={"w-8 h-8 leading-8 pr-2 text-base-content"}/>
          <Text className={"px-2"}>{user?.address || '-'}</Text>
        </View>
      </View>
    );
  }

  if (appLoading) {
    return (
      <View className={"flex-auto"}>
        <NavHeaderLink headerTitle={""}/>
        <AppPageSkeleton/>
      </View>
    )
  }

  async function showNotification() {
    await scheduleNotification(
      'Hello!',
      'This is a notification from Nine'
    );
  }

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <View className={"flex-auto"}>
        {
          appError &&
            <Alert icon={AlertTriangle} variant='destructive' className='max-w-xl'>
                <AlertTitle>{appError?.name}</AlertTitle>
                <AlertDescription>
                  {appError?.message}
                    <View>{appError?.cause}</View>
                </AlertDescription>
            </Alert>
        }
        <NavHeaderLink headerTitle={""}>
          <SignedIn>
            <View className={"flex-1 w-full flex flex-row justify-end gap-x-4"}>
              <Button onPress={showNotification}><Text>SN</Text></Button>
              <SubscribeButton app={app} user={user}/>
              <Link
                asChild
                href={`/app/${id}/update`}
                className={"flex flex-row gap-x-2 h-10 leading-10 rounded-2xl px-4 mr-2 decoration-none"}
              >
                <Button variant={"default"} className={"bg-nine"}>
                  <Text className={"font-bold"}>Edit</Text>
                  <LucidePencil size={16} fill={"white"} color={"transparent"} strokeWidth={2}/>
                </Button>
              </Link>
            </View>
          </SignedIn>
        </NavHeaderLink>

        <ParallaxScrollView
          headerBackgroundColor={{light: '#f3f4f6', dark: '#121C22FF'}}
          headerImage={<AppScreenshots screenshots={app?.screenshots}/>}
        >
          {
            !appLoading &&
              <View className={"flex-1 gap-2 rounded-t-3xl z-10 bg-base-100 dark:bg-base-200"}>
                  <View
                      className={"relative px-0 py-0 rounded-2xl lg:p-2 lg:rounded-2xl bg-background dark:bg-base-300 dark:lg:mb-2"}
                  >
                    {/*<View className={"absolute top-5 right-8"}>
                        <Button size={"sm"} variant={"ghost"} className={"rounded-2xl w-14 h-12 bg-base-100"}>
                            <FontAwesomeIcon icon={"bell"} size={20}/>
                        </Button>
                    </View>*/}
                      <View
                          className="relative flex flex-row justify-start items-center px-2 font-bold text-4xl font-21 text-center rounded-xl bg-inherit z-2">
                          <Avatar
                              alt={app?.name?.toString()!}
                              className="block mx-4 my-4 w-16 h-16 rounded-full radius-circle object-cover object-center"
                          >
                              <AvatarImage source={{uri: app?.logo}}/>
                              <AvatarFallback className={"bg-base-200"}>
                                  <Text
                                      className={"font-bold text-2xl"}>
                                    {app ? app.name![0].toLocaleUpperCase() : undefined}
                                  </Text>
                              </AvatarFallback>
                          </Avatar>
                          <View>
                              <Text className={"font-bold text-4xl"}>{capitalize(app?.name)}</Text>
                            {userRepo?.fork &&
                                <View className={"flex flex-row justify-start items-center"}>
                                    <Text className={"font-medium bg-base-100 px-2 rounded-full"}>Forked from</Text>
                                    <Link
                                        href={userRepo?.parent?.html_url}
                                        className={"underline"}
                                    > {userRepo?.parent?.full_name}</Link>
                                </View>
                            }
                          </View>
                      </View>

                    {/* App Description */}
                      <View
                          className="px-7 pt-2 pb-4 bg-inherit rounded-b-lg lg:font-14 lg:leading-10 lg:px-6 lg:py-5 lg:bg-inherit dark:color-whitesmoke">
                          <Text>
                            {app.truncate_description ? truncateLetters(app.description, 0, 160) : app.description}
                          </Text>
                      </View>

                    {/* App Category */}
                    {
                      app.category &&
                        <CategoryList
                            categories={app.category}
                            className="bg-inherit dark:bg-inherit"
                        />
                    }

                    {/* App's hosted links / Store links */}
                      <View className="flex-1 rounded-xl">
                          <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              className={"flex-1 py-5"}
                          >
                              <View
                                  className={"flex flex-row flex-nowrap justify-start gap-x-4 px-4 w-full empty:pad-0 rounded-xl"}>
                                {
                                  app.playstore_link
                                    ? <Link
                                      asChild
                                      href={app.playstore_link || ""}
                                      target={"_blank"}
                                      className={"flex flex-row items-center flex-shrink-0 gap-4 w-auto h-[60px] rounded-2xl text-center decoration-none bg-muted bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}
                                    >
                                      <View>
                                        <Avatar
                                          alt={app?.name?.toString()!}
                                          className="w-8 h-8 rounded-none object-cover object-center"
                                        >
                                          <AvatarImage source={require('~/assets/images/playstore.png')}/>
                                          <AvatarFallback
                                            className={"bg-muted-foreground"}><Text>PS</Text></AvatarFallback>
                                        </Avatar>
                                        <View className="leading-tight text-left">
                                          <Text className={"text-[14px]"}>Download from</Text>
                                          <Text
                                            className={"font-semibold"}
                                          >
                                            {app.playstore_link ? "Google play store" : "-"}
                                          </Text>
                                        </View>
                                      </View>
                                    </Link>
                                    : null
                                }

                                {
                                  app.appstore_link
                                    ? <Link
                                      asChild
                                      href={app.playstore_link || ""}
                                      target={"_blank"}
                                      className={"flex flex-row items-center flex-shrink-0 gap-4 w-auto h-[60px] rounded-2xl text-center decoration-none bg-muted bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}
                                    >
                                      <View>
                                        <Avatar
                                          alt={app?.name?.toString()!}
                                          className="w-8 h-8 rounded-none object-cover object-center"
                                        >
                                          <AvatarImage source={require('~/assets/images/appstore.png')}/>
                                          <AvatarFallback
                                            className={"bg-muted-foreground"}><Text>AS</Text></AvatarFallback>
                                        </Avatar>
                                        <View className="leading-tight text-left">
                                          <Text className={"text-[14px]"}>Download from</Text>
                                          <Text
                                            className={"font-semibold"}>{app.appstore_link ? "Apple Appstore" : "-"}</Text>
                                        </View>
                                      </View>
                                    </Link>
                                    : null
                                }

                                {
                                  app.external_link
                                    ? <Link
                                      asChild
                                      href={app.external_link || ""}
                                      target={"_blank"}
                                      className={"flex flex-row items-center flex-shrink-0 gap-4 w-auto h-[60px] rounded-2xl text-center decoration-none bg-muted bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}
                                    >
                                      <View>
                                        <Avatar
                                          alt={app?.name?.toString()!}
                                          className="w-8 h-8 rounded-md object-cover object-center"
                                        >
                                          <AvatarImage source={require('~/assets/images/icon-default.png')}/>
                                          <AvatarFallback
                                            className={"bg-muted-foreground"}><Text>AS</Text></AvatarFallback>
                                        </Avatar>
                                        <View className="leading-tight text-left">
                                          <Text className={"text-[14px]"}>Download from</Text>
                                          <Text
                                            className={"font-semibold"}>{getExternalLinkDomain(app.external_link)}</Text>
                                        </View>
                                      </View>
                                    </Link>
                                    : null
                                }
                              </View>
                          </ScrollView>
                      </View>
                  </View>

                  <CardSectionContainer className={"w-full py-8 rounded-2xl"}>
                    {/*
                    1. Show stars, forks,
                    */}
                      <CardSectionBody className={"flex flex-row justify-around gap-y-2"}>
                          <View className={"items-center"}>
                              <View className={"flex flex-row items-center gap-x-1"}>
                                  <View className={"flex-row items-center w-8 h-8"}>
                                      <FontAwesomeIcon
                                          icon={'star'}
                                          color={"gold"}
                                          size={18}
                                      />
                                  </View>
                                  <Text className={"font-black text-xl"}>{userRepo?.stargazers_count}</Text>
                              </View>
                              <Text className={"font-bold"}>Stars</Text>
                          </View>
                          <View className={"items-center"}>
                              <View className={"flex flex-row items-center gap-x-1"}>
                                  <View className={"flex-row items-center w-8 h-8"}>
                                      <FontAwesomeIcon
                                          icon={'code-fork'}
                                          size={18}
                                          secondaryColor={'green'}
                                      />
                                  </View>
                                  <Text className={"font-black text-xl"}>{userRepo?.forks_count}</Text>
                              </View>
                              <Text className={"font-bold"}>Forks</Text>
                          </View>
                          <View className={"items-center"}>
                              <View className={"flex flex-row items-center gap-x-1"}>
                                  <View className={"flex-row items-center w-8 h-8"}>
                                      <FontAwesomeIcon icon={'eye'} size={18}/>
                                  </View>
                                  <Text className={"font-black text-xl"}>{userRepo?.watchers_count}</Text>
                              </View>
                              <Text className={"font-bold"}>Watchers</Text>
                          </View>
                        {/*<View className={"items-center"}>
                            <View className={""}>
                                <Button size={"sm"} variant={"ghost"} className={"rounded-2xl w-14 h-14 bg-base-100"}>
                                    <FontAwesomeIcon icon={"bell"} size={18}/>
                                </Button>
                            </View>
                        </View>*/}
                      </CardSectionBody>
                  </CardSectionContainer>

                  <View className={"gap-y-2 rounded-xl bg-background lg:bg-base-100 dark:bg-background"}>
                    {/* App Details */}
                      <View className={"gap-y-8 p-8 bg-base-10 rounded-xl dark:bg-base-300"}>
                          <View className={"gap-y-4"}>
                              <Text className={"font-bold"}>Languages: </Text>
                              <View className={"flex flex-col flex-wrap gap-3"}>
                                  <View className={"flex-1 flex flex-row gap-2"}>
                                    {convertLanguageData(app?.stack).map((language) => {
                                      const languageIcons = PROGRAMMING_LANGUAGE_ICONS[language.name.toLocaleLowerCase()];
                                      return (
                                        <Pressable
                                          key={language.name}
                                          className={"flex flex-row items-center gap-2"}
                                        >
                                          <Image
                                            style={{
                                              // flex: 1,
                                              width: 20,
                                              height: 20,
                                              backgroundColor: languageIcons ? 'transparent' : '#dedede',
                                              borderWidth: 0,
                                              borderRadius: 4,
                                            }}
                                            source={languageIcons}
                                            placeholder={{BLUR_HASH}}
                                            contentFit="cover"
                                            transition={1000}
                                          />
                                          {/*<Text>{language.name}</Text>*/}
                                        </Pressable>
                                      )
                                    })
                                    }
                                  </View>
                              </View>
                          </View>

                          <View className={"gap-y-4"}>
                              <Text className={"font-bold"}>Collaborators: </Text>
                              <View className={"flex flex-col flex-wrap gap-3"}>
                                  <View className={"flex-1 flex flex-row gap-2 ml-4"}>
                                    {collaborators.map((collaborator) => (
                                      <Pressable key={collaborator.id}
                                                 className={"flex flex-row items-center gap-2 -ml-4"}>
                                        <Avatar alt={""} className="w-12 h-12 rounded-full">
                                          <AvatarImage source={{uri: collaborator.avatar_url}}/>
                                          <AvatarFallback>
                                            <Text>{collaborator.login[0]}</Text>
                                          </AvatarFallback>
                                        </Avatar>
                                        {/*<Text>{collaborator.login}</Text>*/}
                                      </Pressable>
                                    ))}
                                  </View>
                                {collaborators.length > 0 && (
                                  <Text className={"font-semibold text-muted-foreground"}>
                                    ({collaborators.length} {collaborators.length === 1 ? 'collaborator' : 'collaborators'})
                                  </Text>
                                )}
                              </View>
                          </View>

                          <Separator className={"w-full mx-auto"}/>

                          <Text className={"relative font-bold dark:font-bold text-xl"}>
                              Project Details
                            {/*<div className={"absolute top-0 right-2 flex flex-row justify-center items-center bg-base-300 size-10 rounded-lg text-center"}>{appVersions?.results.length}</div>*/}
                          </Text>

                          <View className={"gap-y-8"}>
                              <View className={"gap-y-2"}>
                                  <Text>Website: </Text>
                                {
                                  app.website
                                  && <Link
                                        href={app.website}
                                        className={"font-semibold text-xl underline hover:decoration-2"}
                                    >
                                        <Text>{app.website}</Text>
                                    </Link>
                                }
                              </View>

                            {/*<View className={"gap-y-2 items-start"}>
                                <Text>Current Version:</Text>
                                <Text
                                    className="kbd kbd-lg px-4 py-2 font-semibold text-base border border-b-2 border-neutral-300 bg-neutral-200/50 rounded-2xl">
                                  {app?.current_version?.version ?? "0.1.0"}
                                </Text>
                            </View>*/}
                            {/*<View className={"flex flex-row items-center"}>
                                <View className={"flex-1 gap-y-2 items-start"}>
                                    <Text>Status:</Text>
                                    <View
                                        className="flex flex-row items-center gap-x-1.5 py-1.5 px-3 rounded-full bg-blue-100 dark:bg-blue-800/30">
                                        <View
                                            className="w-1.5 h-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></View>
                                       Active Development
                                        <Text
                                            className={"font-medium text-blue-800 dark:text-blue-500"}>{app.current_version?.release_type}</Text>
                                    </View>
                                </View>
                                <View className={"flex-1 gap-y-2 items-start"}>
                                    <Text>Phase:</Text>
                                    <View
                                        className="flex flex-row justify-start items-center gap-x-1.5 py-1.5 px-3 rounded-full bg-red-100 dark:bg-red-800/30">
                                        <Text
                                            className="w-1.5 h-1.5 inline-block rounded-full bg-red-800 dark:bg-red-500"></Text>
                                        <Text className={"font-medium text-red-800 dark:text-red-500"}>Beta</Text>
                                    </View>
                                </View>
                            </View>*/}
                              <View className="gap-y-2 first:mt-0 items-start">
                                {/*<Text>Release date:</Text>*/}
                                {/*  <Text>Last Activity:</Text>*/}
                                {/*<Text
                                    className="kbd kbd-lg px-4 py-2 font-semibold text-xl border border-b-2 border-neutral-300 bg-neutral-200/50 rounded-2xl">
                                  {
                                    app?.current_version?.created_at
                                      ? new Date(app?.current_version?.created_at).toLocaleDateString("en-us", {
                                        year: "numeric",
                                        month: 'long',
                                        day: 'numeric'
                                      }) : new Date(app?.created_at).toLocaleDateString("en-us", {
                                        year: "numeric",
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                </Text>*/}

                                  <Text>Created at:</Text>
                                  <Text
                                      className="kbd kbd-lg px-4 py-2 font-semibold text-base border border-b-2 border-neutral-300 bg-neutral-200/50 rounded-2xl">
                                    {
                                      userRepo?.created_at
                                      && formattedDate(userRepo?.created_at)}
                                    {/* {new Date(app.current_version.release_date).toDateString()} */}
                                  </Text>
                              </View>
                          </View>
                      </View>

                      <Separator className={"w-11/12 mx-auto"}/>

                      <View className={"gap-y-2 px-6 py-2 rounded-xl dark:bg-base-300"}>
                          <Text className={"font-bold text-xl py-4"}>
                              Latest Feature
                          </Text>
                        {/* <span>Supports markdown</span> */}
                        {/*<div className={"px-4"}>
                            <ul className={"list-disc leading-10"}>
                              <li>You can now pin messages in groups for all current members.</li>
                              <li>You can now check your connection health during a video call by long pressing on your tile.</li>

                              <li>Added a 'view once' option to voice messages.</li>

                              <li>These features will roll out over the coming weeks.</li>
                            </ul>
                          </div>*/}
                          <Markdown>{"### Hi, *Pluto*"}</Markdown>
                          <Text>
                            {
                              app?.current_version?.latest_feature
                            }
                          </Text>
                      </View>

                      <Separator className={"w-11/12 mx-auto"}/>

                      <View
                          className={"flex flex-col px-6 py-4 dark:py-4 rounded-xl dark:bg-base-300"}>
                          <Text
                              className={"radius text-xl font-bold py-4 lg:text-3xl lg:py-4"}>
                            {"Download links"}
                          </Text>
                          <View
                              className={"flex flex-col gap-5 py-5 every:d-block|decoration-none|pad-x2|pad-y3"}>
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
                      </View>
                  </View>

                  <View>
                    {/* App versions */}
                      <CardSectionContainer>
                          <CardHeaderLink
                              headerTitle={"Project Versions"}
                              linkUrl={`/more/${id}/versions`}
                          />
                          <View className={"space-y-2 px-2 lg:px-4 every:d-block|pad-2"}>
                              <BranchesCard app={app} version={repoBranches.slice(0, 4)}/>
                            {/*{*/}
                            {/*  repoBranches?.slice(0, 4).map((eachAppVersion, index) => (*/}
                            {/*    <Link*/}
                            {/*      asChild*/}
                            {/*      key={index} id="id-app-versions"*/}
                            {/*      href={eachAppVersion?.commit?.url}*/}
                            {/*      className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}*/}
                            {/*    >*/}
                            {/*      <View className="leading-tight">*/}
                            {/*        <Text className={"text-base font-bold underline underline-offset-2"}>*/}
                            {/*          {eachAppVersion?.name}*/}
                            {/*          /!*release on {new Date(eachAppVersion?.release_date).toLocaleDateString()}*!/*/}
                            {/*        </Text>*/}
                            {/*        /!*<Text className={"text-[15px]"}>*/}
                            {/*              {truncateLetters(eachAppVersion?.latest_feature, 0, 70)}*/}
                            {/*            </Text>*!/*/}
                            {/*      </View>*/}
                            {/*      /!*<Text*/}
                            {/*            className="w-12 h-12 leading-[48px] square-6 lh-6 text-base font-bold font-18 color-444 dark:color-darkgray">*/}
                            {/*            {eachAppVersion?.version}*/}
                            {/*          </Text>*!/*/}
                            {/*    </Link>*/}
                            {/*  ))*/}
                            {/*}*/}
                            {/*<View
                                id="id-app-download-links"
                                className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}
                            >
                                <Button size={"lg"} className={"w-full bg-nine rounded-2xl"}>
                                    <Text className={"font-semibold text-sm"}>Show all</Text>
                                </Button>
                            </View>*/}
                          </View>
                      </CardSectionContainer>
                  </View>

                  <View>
                      <View
                          className={"app-owner-details flex flex-col space-y-4 mt-1 mg-t-2 py-8 bg-white every:pad-y1 dark:bg-222425 dark:bg-base-200 rounded-xl"}>
                          <Link
                              asChild
                              href={app.owner === session?.user?.primaryEmailAddress?.emailAddress ? "/profile" : `/user/${app.owner.id}`}
                              className={"relative flex flex-row items-center w-full radius px-8 py-4 dark:font-bold decoration-none color-initial dark:color-whitesmoke"}
                          >
                              <View>
                                  <Text className={"font-bold text-xl"}>{"Owner details"}</Text>
                                {/*<span className={"fa fa-angle-right absolute right-8 font-18"}></span>*/}
                                  <LucideChevronRight size={20} strokeWidth={3}
                                                      color={LUCIDE_ICON_THEME_COLOR[colorScheme]}
                                                      className={"absolute right-8"}/>
                              </View>
                          </Link>
                          <View className={"px-4"}>
                              <OwnerContact/>
                          </View>
                      </View>
                  </View>

                  <View
                      className={"app-download-details flex flex-col mt-4 py-8 bg-white dark:bg-222425 dark:bg-base-200 rounded-xl"}>
                      <CardHeaderLink
                          headerTitle={`More Projects by ${user?.firstname}`}
                          linkUrl={`/more/${app?.owner}/apps`}
                      />
                      <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                      >
                          <View
                              className={"flex flex-row gap-2 px-2 py-5 every:d-block|decoration-none|pad-x2|pad-y3 overflow-x-auto"}>
                            {
                              userApps?.length > 0
                                ? userApps?.filter(t => t.id !== app.id).map((eachUserApps, index) => {
                                  return (
                                    index < 5 ? <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} /> : null
                                  )
                                })
                                : (
                                  <Text
                                    className={"mg-x-auto mg-y1 pad-2 font-14 text-center color-gray"}>
                                    No apps yet
                                  </Text>
                                )
                            }
                          </View>
                      </ScrollView>
                  </View>

                {/*<Button
                    onPress={() => toast(new Date().toLocaleString())}
                >
                    <Text>Show current Date</Text>
                </Button>
                <Link href={"/(auth)/select-repo"}>
                    <Text>Select Repo</Text>
                </Link>
                <Link href={"/feedback"}>Send Feedback</Link>*/}
              </View>}
        </ParallaxScrollView>
      </View>
    </Suspense>
  )
}
