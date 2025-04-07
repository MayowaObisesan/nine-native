import {BasicGridAppBoxes} from "~/components/cards/AppCard";
import {View} from "react-native";
import {Card, CardContent, CardTitle} from "./ui/card";
import {Text} from "./ui/text";

export const ProfileBannerAbstractCard = ({userData, userApps}) => {
  return (
    <View
      className={"absolute right-0 bg-green-30 min-w-[400px] w-[46%] flex-1 z-0 flex flex-col items-end gap-y-8 px-8 opacity-15 overflow-hidden"}>
      <View className={"flex flex-row justify-end flex-wrap w-full"}>
        {
          userApps?.slice(0, 1).map((eachApp, index) => (
            <View className={"rotate-6 opacity-60 pointer-events-none select-none"}>
              <BasicGridAppBoxes {...eachApp} />
            </View>
          ))
        }
      </View>
      <View className={"absolute left-48 top-40 flex flex-row"}>
        {
          userApps?.slice(1, 2).map((eachApp, index) => (
            <View className={"rotate-6 opacity-30 pointer-events-none select-none"}>
              <BasicGridAppBoxes {...eachApp} />
            </View>
          ))
        }
      </View>
      <View className={"absolute left-60 -top-32 flex flex-row"}>
        {
          userApps?.slice(2, 3).map((eachApp, index) => (
            <View className={"rotate-6 scale-75 opacity-70 pointer-events-none select-none"}>
              <BasicGridAppBoxes {...eachApp} />
            </View>
          ))
        }
      </View>
      <Card className='w-full bg-white max-w-xs shadow-xl -rotate-6 opacity-60 dark:bg-base-200'>
        <CardContent>
          <Text>{userApps?.length} Apps</Text>
          <Text>{userData?.firstName} has {userApps?.length} Apps</Text>
        </CardContent>
      </Card>

      {/*<View
        className={"card card-bordered card-normal bg-white max-w-xs shadow-xl -rotate-6 opacity-60 dark:bg-base-200"}>
        <View className={"card-body gap-y-6"}>
          <View className={"card-title font-black text-4xl"}>{userApps?.results.length} Apps</View>
          <View className={"text-3xl"}>{userData?.firstname} has {userApps?.results.length} Apps</View>
        </View>
      </View>*/}

      <Card className='w-full bg-white max-w-2xl shadow-xl -rotate-6 -top-2 opacity-60 dark:bg-base-200'>
        <CardContent>
          <CardTitle>Card Title</CardTitle>
          <Text className={"font-black text-4xl"}>Languages / Stacks</Text>
          <Text className={"text-3xl"}>{userData?.firstname} uses these languages</Text>
          <View className="space-x-6 space-y-3">
            {
              "python,javascript,typescript,rust".split(",").map((userProgLang) => (
                <View
                  key={userProgLang}
                  className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-base font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500"
                >
                  <View className="w-1.5 h-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></View>
                  <Text>{userProgLang}</Text>
                </View>
              ))
            }
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
