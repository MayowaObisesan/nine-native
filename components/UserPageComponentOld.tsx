import {Link} from "expo-router";
import {View} from "react-native";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {LucideCalendarPlus, LucideFlag, LucideMapPin, LucidePencil, LucidePhone} from "lucide-react-native";
import {SignedIn, useUser} from "@clerk/clerk-expo";
import * as React from "react";
import {ProfileBanner} from "./ProfileBanner";
import {getSocialAccountHandle} from "~/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {PersonalDetailsSection} from "~/components/PersonalDetailsSection";
import {AppsSection} from "./AppsSection";
import {SocialProfileSection} from "~/components/SocialProfileSection";
import {BasicGridAppBoxes} from "~/components/cards/AppCard";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import {useGetAppByName, useGetUserApps} from "~/hook/useApps";
import {useGetAppSocials} from "~/hook/useSocialList";
import {useUserTimeline} from "~/hook/useTimeline";

export const UserPageComponentOld = ({userId, userData}: {userId: string; userData: any}) => {
  // const size = useDeviceSize();
  // const tokenData = useTokenData();
  const {user} = useUser();
  // const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${tokenData.tokenData?.user_id}/apps/`);
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(userId as string);
  const {
    data: userApps,
    error: userAppsError,
    isLoading: userAppsLoading,
    isFetched: userAppsFetched
  } = useGetUserApps(userData?.primaryEmailAddress.emailAddress);
  // const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}/apps/`);
  // const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);
  // const [timelineList] = useFetch(`${process.env.REACT_APP_BASE_URL}/timeline/?user=${userId}`);
  const {data: socialSitesList} = useGetAppSocials();
  const appSocialList = userData?.social_account_dict ? socialSitesList!?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0 : false;
  const {data: userTimelineData, isLoading, error, refetch} = useUserTimeline(userId);
  // console.log("Timeline", timelineList);
  // const timelineGroupedByDateRef = useRef();
  // const transformedTimelineGroupedByDateRef = useRef([]);

  /*useEffect(() => {
    if (timelineList?.results.length > 0) {
      timelineGroupedByDateRef.current = timelineList.results.reduce((acc, item) => {
        // Extract the date portion (YYYY-MM-DD) from `created_at`
        const date = item.created_at.split("T")[0];
        // Initialize the array if this date doesn't exist
        if (!acc[date]) {
          acc[date] = [];
        }
        // Add the current item to the appropriate date array
        acc[date].push(item);
        return acc;
      }, {});

      transformedTimelineGroupedByDateRef.current = Object.entries(timelineGroupedByDateRef.current).map(([key, value]) => {
        return {
          date: key,
          count: value.length,
          data: value.slice(0, 10),
        }
      })
    }
    console.log(timelineGroupedByDateRef.current);
  }, [timelineList]);*/

  return (
    <View className={"profile-container relative bg-light lg:bg-white-solid dark:bg-111314"}>
      <SignedIn>
        <Link
          asChild
          href={`/profile/update`}
          className={"flex flex-row gap-x-2 absolute right-4 h-10 leading-10 rounded-2xl px-4 decoration-none"}
        >
          <Button variant={"default"} className={"bg-nine"}>
            <Text className={"font-bold"}>Edit</Text>
            <LucidePencil size={16} fill={"white"} color={"transparent"} strokeWidth={2}/>
          </Button>
        </Link>
      </SignedIn>

      {/*Profile Page*/}
      <View className="relative z-10">
        <ProfileBanner
          userData={userData}
          userApps={userApps}
          socialSitesList={socialSitesList}
          removeAbout={true}
        />
      </View>

      <View
        className={"relative hidden flex flex-col justify-center items-center gap-y-2 flex-basis flex-grow py-8 pad-t8 pad-b4 bg-white bg-gradient-to-t from-white dark:from-base-300 to-base-100 dark:to-base-200 to 80% overflow-hidden z-10 dark:bg-000304|color-whitesmoke dark:bg-base-300"}>
        <View
          className={"flex flex-row justify-center absolute -top-16 -z-10 w-full pct:w-120 leading-normal text-base-200/30 color-F8FBF8 text-9xl font-120 font-bold text-center overflow-hidden lg:pct:w-100|neg:top-10|left-5 dark:color-11131466"}>
          <Text>{userData?.firstname}</Text>
        </View>
        <View
          className={"flex flex-row absolute top-8 -left-0 -z-10 w-full pct:w-120 leading-normal text-base-100/80 color-F8F8F8 text-9xl font-120 font-bold text-right overflow-hidden lg:pct:w-100|left-50 dark:color-11131466"}>
          <Text>{userData?.lastname}</Text>
        </View>

        {/*<Avatar
              src={userData?.dp}
              alt={"profile"}
              width={"24"}
              classes={"size-24 leading-[96px] font-bold"}
            >
              {
                !userData?.dp &&
                userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()
              }
            </Avatar>*/}
        <Avatar
          alt={"profile picture"}
          className="block mx-4 my-4 w-16 h-16 rounded-full radius-circle object-cover object-center"
        >
          <AvatarImage source={{uri: userData?.dp}}/>
          <AvatarFallback className={"bg-base-200"}>
            <Text
              className={"font-bold text-2xl"}
            >
              {/*{app ? app.name![0].toLocaleUpperCase() : undefined}*/}
              {
                !userData?.dp &&
                userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()
              }
            </Text>
          </AvatarFallback>
        </Avatar>
        <Text className={"block text-pretty text-4xl font-bold leading-[64px]"}>
          {userData?.firstname} {userData?.lastname}
        </Text>
        <Text className={"relative text-xl leading-normal font-15"}>
          {userData?.email}
        </Text>
        <Text className={"relative text-xl leading-normal font-semibold"}>
          {userData?.phone_no}
        </Text>
        {
          userData?.tags
          && <View className={"relative block my-4 lg:my-10"}>
            {
              "python, javascript, golang".split(",").map((each_user_skills, index) => {
                return (
                  <Text
                    key={index}
                    className={"bg-light radius pad-1 mg-x-2 lg:font-13"}>
                    {each_user_skills}
                  </Text>
                )
              })
            }
            </View>
        }
      </View>

      {/*{*/}
      {/*  // For laptops and devices larger than the laptop*/}
      {/*  size.windowWidth >= deviceWidthEnum.laptop*/}
      {/*    ? <section*/}
      {/*      className={"hidden flex flex-col justify-center items-center w-full pct:w-100 h-[200px] mx-auto mg-x-auto bg-white-solid text-center lg:top-0 lg:h-[480px] py-16 lg:relative|px:top-0|h-480|pad-y8|bg-lighter dark:bg-000304"}>*/}
      {/*      /!*Profile Page*!/*/}
      {/*      <div*/}
      {/*        className={"relative flex flex-row justify-center items-center flex-basis flex-grow bg-transparent overflow-hidden z-10"}>*/}
      {/*        <Avatar*/}
      {/*          src={userData?.dp}*/}
      {/*          alt={"profile"}*/}
      {/*          width={"48"}*/}
      {/*          classes={"size-48 leading-[192px] font-bold text-3xl"}*/}
      {/*        >*/}
      {/*          {*/}
      {/*            !userData?.dp &&*/}
      {/*            userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()*/}
      {/*          }*/}
      {/*        </Avatar>*/}
      {/*        <div*/}
      {/*          className={"block font-24 font-semibold px-4 pt-4 pb-2 lg:text-4xl lg:py-8 lg:font-32|pad-y4 dark:color-darkgray"}>*/}
      {/*          {userData?.firstname} {userData?.lastname}*/}
      {/*          <div*/}
      {/*            className={"relative text-lg font-15 font-light py-2 text-left lg:text-xl lg:py-6 lg:font-18|pad-y3 dark:color-whitesmoke"}>*/}
      {/*            {userData?.email || userData?.phone_no}*/}
      {/*          </div>*/}
      {/*          {*/}
      {/*            userData?.tags*/}
      {/*              ? <div className={"relative block text-left my-2 lg:my-2"}>*/}
      {/*                {*/}
      {/*                  "python, javascript, golang".split(",").map((each_user_skills, index) => {*/}
      {/*                    return (*/}
      {/*                      <span key={index}*/}
      {/*                            className={"bg-light radius p-2 mx-4 lg:text-lg lg:font-13"}>{each_user_skills}</span>*/}
      {/*                    )*/}
      {/*                  })*/}
      {/*                }*/}
      {/*              </div>*/}
      {/*              : null*/}
      {/*          }*/}
      {/*          {*/}
      {/*            userId === tokenData.tokenData?.user_id*/}
      {/*              ? <Link to={"/profile/update"}*/}
      {/*                      className={"block h-5 lh-5 bg-green radius px-4 mt-4 ml-auto decoration-none color-white"}>*/}
      {/*                Edit*/}
      {/*                <span className={"fa fa-pen pl-2 color-white"}></span></Link>*/}
      {/*              : null*/}
      {/*          }*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </section>*/}
      {/*    : null*/}
      {/*}*/}

      {/*{
        // For laptops and devices larger than the laptop
        size.windowWidth >= deviceWidthEnum.laptop
        && <ProfileBanner userData={userData} userApps={userApps} socialSitesList={socialSitesList}/>
      }*/}

      <View className={"flex flex-col lg:flex-row lg:gap-x-12"}>
        <View className={"relative w-full lg:w-[56%] lg:mx-16 lg:top-[40px]"}>
          {/* Personal Details section */}
          <PersonalDetailsSection userData={userData}/>

          {/* Your Apps section */}
          <AppsSection
            userData={userData}
            userApps={userApps}
            userId={userId}
            linkUrl={userId === user?.user_id ? `/user/${user?.user_id}/apps` : "apps"}
          />

          {/* Social Profile section */}
          <SocialProfileSection userData={userData} socialSitesList={socialSitesList} linkUrl={""}/>
        </View>

        {/* User Timeline section */}
        {/*<View className={"relative lg:w-[400px] lg:top-[40px]"}>*/}
        {/*  <PageSectionContainer>*/}
        {/*    <CardHeaderLink headerTitle={"User Timeline section"} linkUrl={""}/>*/}

        {/*    <PageSectionBody>*/}
        {/*      <View>*/}
        {/*        /!* <!-- Timeline --> *!/*/}
        {/*        <View>*/}
        {/*          {*/}
        {/*            transformedTimelineGroupedByDateRef.current.map((eachTimelineItem, index) => (*/}
        {/*              <>*/}
        {/*                <View key={index} className="ps-2 my-2 first:mt-0">*/}
        {/*                  <Text className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">*/}
        {/*                    {eachTimelineItem.date}*/}
        {/*                  </Text>*/}
        {/*                </View>*/}

        {/*                {*/}
        {/*                  eachTimelineItem.data.map((eachTimelineValues, index) => {*/}
        {/*                    const _timelineData = timeLineCategoryMapping(eachTimelineValues);*/}
        {/*                    return (*/}
        {/*                      <View key={index} className="flex gap-x-3">*/}
        {/*                        /!* <!-- Icon --> *!/*/}
        {/*                        <View*/}
        {/*                          className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">*/}
        {/*                          <View*/}
        {/*                            className="relative z-10 w-7 h-7 flex justify-center items-center">*/}
        {/*                            <View*/}
        {/*                              className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600">*/}
        {/*                            </View>*/}
        {/*                          </View>*/}
        {/*                        </View>*/}
        {/*                        /!* <!-- End Icon --> *!/*/}

        {/*                        /!* <!-- Right Content --> *!/*/}
        {/*                        <View className="grow pt-0.5 pb-8">*/}
        {/*                          <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">*/}
        {/*                            <svg className="flex-shrink-0 w-4 h-4 mt-1"*/}
        {/*                                 xmlns="http://www.w3.org/2000/svg" width="24"*/}
        {/*                                 height="24" viewBox="0 0 24 24" fill="none"*/}
        {/*                                 stroke="currentColor" strokeWidth="2"*/}
        {/*                                 strokeLinecap="round" strokeLinejoin="round">*/}
        {/*                              <path*/}
        {/*                                d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>*/}
        {/*                              <polyline points="14 2 14 8 20 8"/>*/}
        {/*                              <line x1="16" x2="8" y1="13" y2="13"/>*/}
        {/*                              <line x1="16" x2="8" y1="17" y2="17"/>*/}
        {/*                              <line x1="10" x2="8" y1="9" y2="9"/>*/}
        {/*                            </svg>*/}
        {/*                            {_timelineData.category} {eachTimelineValues.app ? `- ${eachTimelineValues.app.name}` : ''}*/}
        {/*                          </h3>*/}
        {/*                          <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">*/}
        {/*                            {_timelineData.title}*/}
        {/*                          </Text>*/}
        {/*                          <button type="button"*/}
        {/*                                  className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">*/}
        {/*                            /!*<img className="flex-shrink-0 w-4 h-4 rounded-full"*/}
        {/*                                                                 src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"*/}
        {/*                                                                 alt="Image Description"/>*!/*/}
        {/*                            <Avatar*/}
        {/*                              src={userData?.dp}*/}
        {/*                              alt={"profile"}*/}
        {/*                              width={"8"}*/}
        {/*                              classes={"size-8 leading-[96px] font-bold bg-base-400"}*/}
        {/*                            >*/}
        {/*                              {*/}
        {/*                                !userData?.dp &&*/}
        {/*                                userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()*/}
        {/*                              }*/}
        {/*                            </Avatar>*/}
        {/*                            {userData.firstname} {userData.lastname}*/}
        {/*                          </button>*/}
        {/*                        </View>*/}
        {/*                        /!* <!-- End Right Content --> *!/*/}
        {/*                      </View>*/}
        {/*                    )*/}
        {/*                  })*/}
        {/*                }*/}
        {/*              </>*/}
        {/*            ))*/}
        {/*          }*/}

        {/*          /!* <!-- Item --> *!/*/}
        {/*          <div className="hidden flex gap-x-3">*/}
        {/*            /!* <!-- Icon --> *!/*/}
        {/*            <div*/}
        {/*              className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">*/}
        {/*              <div className="relative z-10 w-7 h-7 flex justify-center items-center">*/}
        {/*                <div*/}
        {/*                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Icon --> *!/*/}

        {/*            /!* <!-- Right Content --> *!/*/}
        {/*            <div className="grow pt-0.5 pb-8">*/}
        {/*              <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">*/}
        {/*                Release v5.2.0 quick bug fix 🐞*/}
        {/*              </h3>*/}
        {/*              <button type="button"*/}
        {/*                      className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">*/}
        {/*                                        <span*/}
        {/*                                          className="flex flex-shrink-0 justify-center items-center w-4 h-4 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">*/}
        {/*                                            A*/}
        {/*                                        </span>*/}
        {/*                Alex Gregarov*/}
        {/*              </button>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Right Content --> *!/*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Item --> *!/*/}

        {/*          /!* <!-- Item --> *!/*/}
        {/*          <div className="hidden flex gap-x-3">*/}
        {/*            /!* <!-- Icon --> *!/*/}
        {/*            <div*/}
        {/*              className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">*/}
        {/*              <div className="relative z-10 w-7 h-7 flex justify-center items-center">*/}
        {/*                <div*/}
        {/*                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Icon --> *!/*/}

        {/*            /!* <!-- Right Content --> *!/*/}
        {/*            <div className="grow pt-0.5 pb-8">*/}
        {/*              <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">*/}
        {/*                Marked "Install Charts" completed*/}
        {/*              </h3>*/}
        {/*              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">*/}
        {/*                Finally! You can check it out here.*/}
        {/*              </p>*/}
        {/*              <button type="button"*/}
        {/*                      className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">*/}
        {/*                <img className="flex-shrink-0 w-4 h-4 rounded-full"*/}
        {/*                     src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"*/}
        {/*                     alt="Image Description"/>*/}
        {/*                James Collins*/}
        {/*              </button>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Right Content --> *!/*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Item --> *!/*/}

        {/*          /!* <!-- Heading --> *!/*/}
        {/*          <div className="hidden ps-2 my-2">*/}
        {/*            <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">*/}
        {/*              31 Jul, 2023*/}
        {/*            </h3>*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Heading --> *!/*/}

        {/*          /!* <!-- Item --> *!/*/}
        {/*          <div className="hidden flex gap-x-3">*/}
        {/*            /!* <!-- Icon --> *!/*/}
        {/*            <div*/}
        {/*              className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">*/}
        {/*              <div className="relative z-10 w-7 h-7 flex justify-center items-center">*/}
        {/*                <div*/}
        {/*                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Icon --> *!/*/}

        {/*            /!* <!-- Right Content --> *!/*/}
        {/*            <div className="grow pt-0.5 pb-8">*/}
        {/*              <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">*/}
        {/*                Take a break ⛳️*/}
        {/*              </h3>*/}
        {/*              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">*/}
        {/*                Just chill for now... 😉*/}
        {/*              </p>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Right Content --> *!/*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Item --> *!/*/}

        {/*          /!* <!-- Collapse --> *!/*/}
        {/*          <div id="hs-timeline-collapse"*/}
        {/*               className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"*/}
        {/*               aria-labelledby="hs-timeline-collapse-content">*/}
        {/*            /!* <!-- Heading --> *!/*/}
        {/*            <div className="ps-2 my-2 first:mt-0">*/}
        {/*              <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">*/}
        {/*                30 Jul, 2023*/}
        {/*              </h3>*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Heading --> *!/*/}

        {/*            /!* <!-- Item --> *!/*/}
        {/*            <div className="flex gap-x-3">*/}
        {/*              /!* <!-- Icon --> *!/*/}
        {/*              <div*/}
        {/*                className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">*/}
        {/*                <div className="relative z-10 w-7 h-7 flex justify-center items-center">*/}
        {/*                  <div*/}
        {/*                    className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>*/}
        {/*                </div>*/}
        {/*              </div>*/}
        {/*              /!* <!-- End Icon --> *!/*/}

        {/*              /!* <!-- Right Content --> *!/*/}
        {/*              <div className="grow pt-0.5 pb-8">*/}
        {/*                <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">*/}
        {/*                  Final touch ups*/}
        {/*                </h3>*/}
        {/*                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">*/}
        {/*                  Double check everything and make sure we're ready to go.*/}
        {/*                </p>*/}
        {/*              </div>*/}
        {/*              /!* <!-- End Right Content --> *!/*/}
        {/*            </div>*/}
        {/*            /!* <!-- End Item --> *!/*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Collapse --> *!/*/}

        {/*          /!* <!-- Item --> *!/*/}
        {/*          <div className="ps-[7px] flex gap-x-3">*/}
        {/*            <button type="button"*/}
        {/*                    className="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-blue-600 font-medium decoration-2 hover:underline dark:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"*/}
        {/*                    id="hs-timeline-collapse-content"*/}
        {/*                    data-hs-collapse="#hs-timeline-collapse">*/}
        {/*              <svg className="flex-shrink-0 w-3.5 h-3.5"*/}
        {/*                   xmlns="http://www.w3.org/2000/svg" width="24" height="24"*/}
        {/*                   viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"*/}
        {/*                   strokeLinecap="round" strokeLinejoin="round">*/}
        {/*                <path d="m6 9 6 6 6-6"/>*/}
        {/*              </svg>*/}
        {/*              Show older*/}
        {/*            </button>*/}
        {/*          </div>*/}
        {/*          /!* <!-- End Item --> *!/*/}
        {/*        </View>*/}
        {/*        /!* <!-- End Timeline --> *!/*/}
        {/*      </View>*/}
        {/*    </PageSectionBody>*/}
        {/*  </PageSectionContainer>*/}
        {/*</View>*/}
      </View>

      {/* Personal Details section */}
      <View
        className={"hidden flex flex-col pt-8 pb-8 bg-white-solid lg:w-[64%] lg:mx-auto lg:pct:w-64|mg-x-auto dark:bg-inherit|radius-top-right|radius-top-left"}>
        <Text
          className={"font-15 px-4 py-4 font-medium lg:text-lg lg:py-8 lg:font-18|pad-y4 dark:color-whitesmoke"}>
          {"Personal details"}
        </Text>

        {/*{JSON.stringify(userData)}*/}
        <View
          className={"*:flex *:flex-col *:my-2 *:p-2 *:text-base every:flex|flex-column|mg-y1|pad-2|font-14 dark:color-whitesmoke"}>
          {
            userData?.firstname !== ""
            && <View className={""}>
                  <Text className={"lg:font-16"}>About {userData?.firstname}</Text>
                  <Text className={"py-2 lg:font-13|lh-40"}>
                    {/* {userData?.about_me || "About me is a service that shows you a summary of each search results, so you can make better choices with your search."} */}
                    {userData?.about_me || "-"}
                  </Text>
              </View>
          }
          <View className={""}>
            <View className={"lg:font-14"}>
              {/*<span className={"fa fa-phone square-4 lh-4 color-999"}></span> */}
              <LucidePhone/>
              <Text>Mobile:</Text>
            </View>
            <Link
              href={`tel:${userData?.phone_no}`}
              className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>
              {userData?.phone_no || "-"}
            </Link>
          </View>
          <View className={""}>
            <View className={"lg:font-14"}>
              {/*<span className="fa fa-map square-4 lh-4 color-999"></span>*/}
              <LucideMapPin/>
              <Text>Address:</Text>
            </View>
            <Text
              className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>
              {userData?.address || "-"}
            </Text>
          </View>
          <View className={""}>
            <View className={"lg:font-14"}>
              {/*<span className={"fa fa-flag square-4 lh-4 color-999"}></span>*/}
              <LucideFlag/>
              <Text>Country:</Text>
            </View>
            <Text className={"pad-l5 pad-y1"}>{userData?.country || "-"}</Text>
          </View>
          <View className={""}>
            <View className={"lg:font-14"}>
              {/*<span className="fa fa-calendar-plus square-4 lh-4 color-999"></span>*/}
              <LucideCalendarPlus/>
              <Text>Date Joined:</Text>
            </View>
            <Text
              className={"pad-l5 pad-y1 color-999"}
            >
              {new Date(userData?.date_joined).toLocaleDateString() || "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* Your Apps section */}
      <View
        className={"hidden flex flex-col mg-y-pad-t4 pad-b4 bg-white-solid lg:pct:w-64|mg-x-auto dark:bg-inherit"}>
        {
          userId === user?.user_id
            ? <CardHeaderLink headerTitle={"Your Apps"} linkUrl={`/user/${user?.user_id}/apps`}/>
            : <CardHeaderLink headerTitle={"Your Apps"} linkUrl={`/user/${user?.user_id}/apps`}/>
        }
        {/*{
          userId === user?.user_id
            ? <Link
              href={`/user/${user?.user_id}/apps`}
              className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}
            >
              {"Your Apps"}
              <span className={"fa fa-angle-right abs right-4 font-18"}></span>
            </Link>
            : <Link
              href={"apps"}
              className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}
            >
              {userId === user?.user_id ? "Your Apps" : `${userData?.firstname} Apps`}
              <span className={"fa fa-angle-right abs right-4 font-18"}></span>
            </Link>
        }*/}
        <View className={"flex flex-row flex-nowrap justify-start align-items-start pad-x2 overflow-x-auto"}>
          {
            userApps?.length > 0
              ? userApps?.map((eachUserApps, index) => {
                return (
                  index < 6 && <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} />
                )
              })
              : <View className={"mg-x-auto mg-y1 pad-2 font-14 text-center color-gray"}>No apps yet</View>
          }
        </View>
        {/*{JSON.stringify(userData)}*/}
        {/*{*/}
        {/*  userData?.clicks > 0*/}
        {/*    ? <View className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>*/}
        {/*      <div className={""}>*/}
        {/*        <span className={""}>*/}
        {/*          /!*<span className={"fa fa-eye square-4 lh-4 text-center color-999"}></span>*!/*/}
        {/*          <Text>144 views</Text>*/}
        {/*        </span>*/}
        {/*        /!*<span className={"pad-l4 pad-y1"}>{userData?.phone_no || <NotDefined />}</span>*!/*/}
        {/*      </div>*/}
        {/*      <div className={""}>*/}
        {/*                        <span className={""}><span*/}
        {/*                          className={"fa fa-smile square-4 lh-4 text-center color-999"}></span> 16 reactions (Likes, clap) </span>*/}
        {/*        /!*<span className={"pad-l4 pad-y1"}>{userData?.country || <NotDefined />}</span>*!/*/}
        {/*      </div>*/}
        {/*      <div className={""}>*/}
        {/*                        <span className={""}><span*/}
        {/*                          className="fa fa-save square-4 lh-4 text-center color-999"></span> 4 saves </span>*/}
        {/*        /!*<span className={"pad-l4 pad-y1"}>{userData?.address || <NotDefined />}</span>*!/*/}
        {/*      </div>*/}
        {/*      <div className={""}>*/}
        {/*                        <span className={""}><span*/}
        {/*                          className="fa fa-money square-4 lh-4 text-center color-999"></span> 5 Donations (#6000) </span>*/}
        {/*        /!*<span className={"pad-l4 pad-y1"}>{new Date(userData?.date_joined).toLocaleDateString() || <NotDefined />}</span>*!/*/}
        {/*      </div>*/}
        {/*    </View>*/}
        {/*    : null*/}
        {/*}*/}
      </View>

      {/* Social Profile section */}
      <View
        className={"hidden flex flex-col mg-y-pad-t4 pad-b4 bg-white-solid lg:pct:w-64|mg-x-auto dark:bg-inherit"}>
        <CardHeaderLink headerTitle={"Social Profile"} linkUrl={""}/>
        {/*<header
          className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}>
          {"Social Profile"}
          <span className={"fa fa-angle-right abs right-4 font-18"}></span>
        </header>*/}
        <View className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
          {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).every(key=>item === userData?.social_account_dict[key]))}*/}
          {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item))}*/}
          {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length}*/}
          {
            userData
            && appSocialList
              ? socialSitesList?.map((socialSite, index) => {
                if (userData?.social_account_dict[socialSite]) {
                  return (
                    <View
                      key={index}
                      className={"dark:color-whitesmoke"}>
                      <View className={""}>
                        {/*<span className={`fab fa-${socialSite} square-4 lh-4 text-center color-999`}></span>*/}
                        <Text>{socialSite}:</Text>
                      </View>
                      <Link
                        href={userData?.social_account_dict[socialSite]}
                        target={"_blank"}
                        rel="noreferrer"
                        className={"pad-l4 pad-y1 font-semibold color-initial dark:color-darkgray"}
                      >
                        @{getSocialAccountHandle(userData?.social_account_dict[socialSite])}
                      </Link>
                    </View>
                  )
                }
              })
              : <Text className={"text-center color-gray"}>No account configured</Text>
          }
          {/*{Object.keys(userData?.social_account_dict)?.length > 0 ? "" : <div className={"pad-4 text-center"}>No site linked</div>}*/}
          {/*<div className={""}>
                        <span className={""}><span className="fab fa-instagram square-4 lh-4 text-center color-999"></span>Instagram: </span>
                        <span className={"pad-l4 pad-y1"}>{"-"}</span>
                    </div>*/}
        </View>
      </View>
    </View>
  )
}
