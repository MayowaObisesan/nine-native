import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {LucideChevronRight} from "lucide-react-native";
import {LUCIDE_ICON_THEME_COLOR} from "~/lib/constants";
import {router} from "expo-router";
import * as React from "react";
import {useColorScheme} from "~/lib/useColorScheme";

interface I_CardHeaderProps {
  headerTitle: string,
  linkUrl?: string,
  hideArrow?: boolean
}

export const CardHeaderLink = ({headerTitle, linkUrl, hideArrow = false}: I_CardHeaderProps) => {
  const {colorScheme} = useColorScheme();

  return (
    <View>
      <Pressable
        onPress={() => {linkUrl ? router.push(linkUrl) : null}}
        className={"relative flex flex-row items-center w-full radius px-8 py-8 dark:font-bold decoration-none color-initial dark:color-whitesmoke"}
      >
        <Text className={"font-semibold text-xl"}>
          {headerTitle}
        </Text>
        {!hideArrow && <LucideChevronRight
            size={20}
            strokeWidth={3}
            color={LUCIDE_ICON_THEME_COLOR[colorScheme]}
            className={"absolute right-8"}
        />}
      </Pressable>
    </View>
  )
}
