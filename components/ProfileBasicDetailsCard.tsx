import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {Link} from "expo-router";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import * as React from "react";

export const ProfileBasicDetailsCard = ({userData}: {userData: any}) => {
  return (
    <View
      className={"relative flex flex-col md:flex-row justify-start items-center md:gap-x-8 lg:gap-x-4 flex-basis flex-grow bg-white/60 md:bg-base-100 dark:bg-base-200 py-12 md:px-16 lg:px-16 md:py-24 rounded-3xl overflow-hidden"}>
      <Avatar
        alt={"profile picture"}
        className="block mx-4 my-4 w-32 h-32 rounded-full radius-circle object-cover object-center"
      >
        <AvatarImage source={{uri: userData?.imageUrl}} />
        <AvatarFallback className={"bg-base-200"}>
          <Text
            className={"font-bold text-2xl"}
          >
            {userData?.firstName && userData?.firstName![0]?.toLocaleUpperCase() + userData?.lastName![0]?.toLocaleUpperCase()}
          </Text>
        </AvatarFallback>
      </Avatar>

      <View
        className={"block dark:color-darkgray"}>
        <Text className={"font-bold px-4 py-6 text-center text-4xl md:text-6xl md:text-left"}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <View className={"flex flex-col items-center md:flex-row flex-wrap justify-center md:justify-start"}>
          <View className={"flex flex-col items-center gap-y-3"}>
            <View className={"relative text-xl leading-normal font-15"}>
              <Link
                href={`mailto: ${userData?.primaryEmailAddress.emailAddress}`}
                className={"hover:underline"}
              >
                {userData?.primaryEmailAddress.emailAddress}
              </Link>
            </View>
            <View className={"relative text-xl leading-normal font-semibold"}>
              <Link
                href={`tel: ${userData?.phone_no}`}
                className={"font-semibold md:font-normal hover:underline"}
              >
                {userData?.phone_no}
              </Link>
            </View>
          </View>

          {/*{
            size.windowWidth < deviceWidthEnum.tablet
              ? <div className={"flex flex-col items-center gap-y-3"}>
                <div className={"relative text-xl leading-normal font-15"}>
                  <a href={`mailto: ${userData?.email}`}
                     className={"hover:underline"}>{userData?.email}</a>
                </div>
                <div className={"relative text-xl leading-normal font-semibold"}>
                  <a href={`tel: ${userData?.phone_no}`}
                     className={"font-semibold md:font-normal hover:underline"}>{userData?.phone_no}</a>
                </div>
              </div>
              : <>
                <ListContentContainer
                  icon={<span className={"fa fa-message"}></span>}
                  classes={"hover:underline rounded-2xl"}
                  body={<a href={`mailto: ${userData?.email}`}>{userData?.email}</a>}
                />
                <ListContentContainer
                  icon={<span className={"fa fa-mobile"}></span>}
                  classes={"hover:underline rounded-2xl"}
                  body={<a href={`tel: ${userData?.phone_no}`}
                           className={"font-semibold md:font-normal"}>{userData?.phone_no}</a>}
                />
              </>
          }*/}
        </View>

        {
          userData?.tags
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
  )
}
