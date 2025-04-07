import {View} from "react-native";
import {Skeleton} from "~/components/ui/skeleton";
import React from "react";

export default function AppPageSkeleton() {
  return (
    <View>
      <Skeleton className="rounded-xl">
        <View className={"gap-y-8 px-6 py-4 bg-background"}>
          <View className={"flex flex-row items-center gap-x-4 w-full"}>
            <View className={"w-16 h-16 rounded-full bg-base-200"}></View>
            <View className={"flex-1 w-full gap-y-2"}>
              <View className="w-4/5 h-8 rounded-xl bg-base-100"/>
            </View>
            <View className="w-10 h-10 rounded-xl bg-base-100"/>
          </View>
          <View className="w-4/5 h-8 rounded-xl bg-base-100"/>
          <View className={"flex-1 flex flex-row items-center gap-x-4 w-4/5"}>
            <View className="w-1/4 h-10 rounded-xl bg-base-100"/>
            <View className="w-1/3 h-10 rounded-xl bg-base-100"/>
            <View className="w-1/3 h-10 rounded-xl bg-base-100"/>
          </View>

          {/* Download cards */}
          <View className={"flex-1 flex flex-row items-center gap-x-4 w-full"}>
            <View className="w-2/4 h-16 rounded-2xl bg-base-100"/>
            <View className="w-2/4 h-16 rounded-2xl bg-base-100"/>
          </View>
        </View>

        <View className={"gap-y-8 p-6 bg-background"}>
          <View className="w-2/5 h-8 rounded-xl bg-base-100"/>
        </View>
      </Skeleton>
    </View>
  )
}
