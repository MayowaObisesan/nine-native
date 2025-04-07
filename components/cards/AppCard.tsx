import {router} from "expo-router";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import * as React from "react";
import {capitalize, convertLanguageData, getOwnerAndRepoFromUrl, truncateLetters} from "~/lib/utils";
import {useGetGithubRepo} from "~/hook/useGithub";
import {BLUR_HASH, PROGRAMMING_LANGUAGE_ICONS} from "~/lib/constants";
import {Image} from "expo-image";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export const BasicGridAppBoxes = (app: any) => {
  return (
    <View
      key={app.name}
      className="flex-1 relative radius rounded-lg mx-1 p-2 bg-base-100 hover:bg-base-200 dark:bg-base-200 dark:hover:bg-base-100 border:0px_solid_BBB hover:bg-light|cursor-pointer lg:w-unset dark:bg-222324 dark:lg:bg-transparent dark:lg:hover:bg-333435">
      <Pressable
        style={({pressed}) => [
          // styles.card,
          {opacity: pressed ? 0.9 : 1}
        ]}
        onPress={() => router.push('app/' + app?.name)}
        className="flex-1 relative flex flex-col justify-start items-start gap-2 w-full pct:w-100 decoration-none color-initial font-16 dark:color-whitesmoke"
      >
        <View className={"flex-1 w-44 max-w-44"}>
          {/*<img
            src={app.logo}
            alt={`${app.name} logo`}
            width={"160"}
            height={"240"}
            className="align-self-center min-w-[160px] max-w-[160px] h-[240px] bg-lighter rounded-lg radius object-cover object-center lg:min-w-[240px] lg:max-w-[240px] lg:min-w-240|max-w-240 dark:bg-222425"
          />*/}
          <Avatar alt={""} className="w-full h-60 rounded-lg object-cover object-center">
            <AvatarImage source={{uri: app.logo}} className={"rounded-none"}/>
            <AvatarFallback className={"rounded-none bg-base-200"}>
              <Text>{""}</Text>
            </AvatarFallback>
          </Avatar>
          <View className={"py-2 w-full text-ellipsis overflow-x-hidden whitespace-nowrap"}>
            <Text className={"pl-1 font-bold"}>{app.name ? capitalize(app.name) : ""}</Text>
            <Text className={"w-full pl-1"}>{truncateLetters(app.description, 0, 20)}</Text>
          </View>
        </View>
      </Pressable>
      {app.children}
    </View>
  )
}

export const MiniBasicGridAppBoxes = (app: any) => {
  return (
    <View
      key={app.name}
      className="flex-1 relative radius rounded-lg mx-1 px-1.5 py-1 bg-base-100 hover:bg-base-200 dark:bg-base-200 dark:hover:bg-base-100 border:0px_solid_BBB hover:bg-light|cursor-pointer lg:w-unset dark:bg-222324 dark:lg:bg-transparent dark:lg:hover:bg-333435">
      <Pressable
        style={({pressed}) => [
          // styles.card,
          {opacity: pressed ? 0.9 : 1}
        ]}
        onPress={() => router.push('app/' + app?.name)}
        className="flex-1 relative flex flex-col justify-start items-start gap-2 w-full pct:w-100 decoration-none color-initial font-16 dark:color-whitesmoke"
      >
        <View className={"flex-1 w-full"}>
          {/*<img
            src={app.logo}
            alt={`${app.name} logo`}
            width={"160"}
            height={"240"}
            className="align-self-center min-w-[160px] max-w-[160px] h-[240px] bg-lighter rounded-lg radius object-cover object-center lg:min-w-[240px] lg:max-w-[240px] lg:min-w-240|max-w-240 dark:bg-222425"
          />*/}
          <Avatar alt={""} className="flex-1 w-full rounded-lg object-cover object-center">
            <AvatarImage source={{uri: app.logo}} className={"rounded-none"}/>
            <AvatarFallback className={"rounded-none bg-base-200"}>
              <Text>{""}</Text>
            </AvatarFallback>
          </Avatar>
          <View className={"py-1 w-full text-ellipsis overflow-x-hidden whitespace-nowrap"}>
            <Text className={"pl-1 font-bold text-xs"}>{app.name ? capitalize(app.name) : ""}</Text>
            <Text className={"w-full pl-1 text-xs"}>{truncateLetters(app.description, 0, 20)}</Text>
          </View>
        </View>
      </Pressable>
      {app.children}
    </View>
  )
}

export function ListAppCard({app}: { app: any }) {
  const [owner, repo] = getOwnerAndRepoFromUrl(app?.github_repo);
  const {data} = useGetGithubRepo(owner, repo);
  const languageArray = convertLanguageData(app?.stack);
  const languageIcons = data && PROGRAMMING_LANGUAGE_ICONS[data?.language?.toLocaleLowerCase()];

  return (
    <Pressable className={"flex-row justify-start items-center gap-4"}
               onPress={() => router.push(`app/${app?.name_id}`)}>
      <Avatar alt={""} className="w-12 h-12 object-cover object-center">
        <AvatarImage source={{uri: app.logo}}/>
        <AvatarFallback className={"rounded-none bg-base-200"}>
          <Text>{""}</Text>
        </AvatarFallback>
      </Avatar>

      <View className={"flex-1 w-full"}>
        <Text className={"font-bold"}>{app?.name && capitalize(app?.name)}</Text>
        <View className={"flex flex-col w-full"}>
          <Text
            className={"w-full text-ellipsis overflow-x-hidden whitespace-nowrap"}>{truncateLetters(app.description, 0, 48)}</Text>
        </View>
        <View className={"flex-row justify-between gap-x-2 w-full"}>
          {data?.language &&
              <View
                  className={"flex flex-row justify-start items-center gap-x-1 px-2 py-1 bg-base-100 rounded-full border border-base-200"}>
                  <Image
                      style={{
                        // flex: 1,
                        width: 16,
                        height: 16,
                        backgroundColor: languageIcons ? 'transparent' : '#dedede',
                        borderWidth: 0,
                        borderRadius: 6,
                      }}
                      source={languageIcons}
                      placeholder={{BLUR_HASH}}
                      contentFit="cover"
                      transition={1000}
                  />
                  <Text className={"font-medium text-sm leading-snug"}>
                    {languageArray.length > 1 && ` + ${languageArray.length - 1} more`}
                  </Text>
              </View>}
          {
            data && data?.stargazers_count > 0 &&
              <View className={"flex flex-row items-center gap-x-2 px-2"}>
                  <FontAwesomeIcon icon={'star'} color={'gold'} size={16} />
                  <Text className={"font-bold"}>{data?.stargazers_count}</Text>
              </View>
          }
        </View>
      </View>
    </Pressable>
  )
}
