import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {cn} from "~/lib/utils";
import {ReactElement} from "react";

interface I_ListContentContainerProps {
  icon?: ReactElement;
  title?: ReactElement | string;
  body?: ReactElement | string;
  classes?: string;
  children?: ReactElement;
}

export const ListContentContainer = ({icon, title, body, classes, children}: I_ListContentContainerProps) => {
  return (
    <View className={cn("flex flex-row items-start gap-x-2 px-2 py-4", classes)}>
      {
        icon &&
          <View className="w-10 h-10 leading-10 py-1 text-center">{icon}</View>
      }
      <View className="">
        {title && <Text>{title}</Text>}
        {body && <Text className="text-xl">{body}</Text>}
        {children}
      </View>
    </View>
  )
}
