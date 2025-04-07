import {View} from "react-native";
import {Skeleton} from "~/components/ui/skeleton";
import React from "react";

export default function ProfilePageSkeleton() {
  return (
    Array.from({length: 5}).map((_, index) => (
      <View key={index}>
        <Skeleton className="rounded-xl">
          <View className="h-20 rounded-xl bg-default-100"/>
        </Skeleton>
      </View>
    ))
  )
}
