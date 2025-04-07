import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {APP_NAME} from "~/lib/constants";
import {LucideSearch} from "lucide-react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {Link, router} from "expo-router";
import {ThemeToggle} from "~/components/ThemeToggle";
import ProfileDropDown from "~/components/ProfileDropdown";
import * as React from "react";
import {useColorScheme} from "~/lib/useColorScheme";

export default function Navbar() {
  const {isDarkColorScheme} = useColorScheme();

  return (
    <View className={"flex flex-row justify-between items-center gap-5 px-6 py-4 w-full"}>
      {/* The name of the Page */}
      <View>
        <Link href={"/"}>
          <Text className={"font-bold text-2xl"}>{APP_NAME}</Text>
        </Link>
      </View>
      <View className={"flex flex-row justify-between items-center gap-6"}>
        <LucideSearch
          size={24}
          color={isDarkColorScheme ? DarkTheme.colors.text : DefaultTheme.colors.text}
          onPress={() => router.push("/search")}/>
        <ThemeToggle/>
        <ProfileDropDown/>
      </View>
    </View>
  )
}
