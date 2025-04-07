import {View} from "react-native";
import * as React from "react";
import {ReactElement} from "react";
import {cn} from "~/lib/utils";

export const CardSectionContainer = ({className, children}: {
  className?: string;
  children: ReactElement | ReactElement[] | null
}) => {
  return (
    <View
      className={cn("flex flex-col rounded-xl pb-4 bg-background dark:bg-base-300", className)}>
      {children}
    </View>
  )
}

export const CardSectionBody = ({className, children}: {
  className?: string;
  children: ReactElement | ReactElement[] | null
}) => {
  return (
    <View
      className={cn("px-4", className)}>
      {children}
    </View>
  )
}

export const PageSectionContainer = ({classes, children}: { classes?: string; children?: ReactElement }) => {
  return (
    <View className={`flex flex-col pt-8 pb-8 ${classes}`}>
      {children}
    </View>
  )
}

export const PageSectionBody = ({classes, children}: { classes?: string; children?: ReactElement }) => {
  return (
    <View className={`${classes}`}>
      {children}
    </View>
  )
}
