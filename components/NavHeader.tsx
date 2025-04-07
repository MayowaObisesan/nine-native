import {Link, router} from "expo-router";
import {LucideChevronLeft} from "lucide-react-native";
import {Button} from "~/components/ui/button";
import {View} from "react-native";
import {cn} from "~/lib/utils";
import React from "react";
import {Text} from "~/components/ui/text";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useColorScheme} from "~/lib/useColorScheme";

interface NavHeaderLinkProps {
  showTitle?: boolean;
  headerTitle: string;
  showArrow?: boolean;
  linkUrl?: string;
  fixTop?: boolean;
  noFix?: boolean;
  children?: React.ReactNode;
}

export const NavHeaderLink = ({showTitle, headerTitle, showArrow, linkUrl, fixTop, noFix, children}: NavHeaderLinkProps) => {
  const {isDarkColorScheme} = useColorScheme();
  let relativeType = "sticky";
  if (fixTop) {
    relativeType = "fixed";
  } else if (noFix) {
    relativeType = "relative";
  }
  return (
    <View
      className={cn(relativeType, " top-0 left-0 flex flex-row justify-start items-center w-full h-20 backdrop-blur-2xl border-b border-muted z-10 dark:bg-base-300")}>
      {
        showArrow !== false
          ? (
            linkUrl === undefined || linkUrl === ""
              ? (
                <Button
                  variant={"link"}
                  className="w-20 border-0 z-10 decoration-none"
                  onPress={() => router.canGoBack() ? router.back() : router.push("/")}
                >
                  <Text asChild className={"text-foreground text-center"}>
                    <LucideChevronLeft color={isDarkColorScheme ? DarkTheme.colors.text : DefaultTheme.colors.text} size={28} strokeWidth={3} className="w-6 h-full"/>
                  </Text>
                  {/*<span className="fa fa-angle-left text-xl font-18 color-999"></span>*/}
                </Button>
              )
              : (
                <Link
                  href={linkUrl}
                  className="block w-16 h-16 square-8 lh-9 border-0 text-center z-10 decoration-none">
                  <LucideChevronLeft color={isDarkColorScheme ? DarkTheme.colors.text : DefaultTheme.colors.text} className="w-6 h-full text-foreground"/>
                  {/*<span className="fa fa-angle-left text-xl font-18 color-999"></span>*/}
                </Link>
              )
          )
          : null
      }
      {showTitle !== false && <View className={"flex flex-row items-center h-20 leading-[80px]"}>
        <Text className=" font-bold text-2xl text-left">
          {headerTitle}
        </Text>
      </View>}
      {children}
    </View>
  );
}
