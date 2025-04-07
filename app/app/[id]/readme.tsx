import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import Markdown from "react-native-markdown-display";
import {useGetAppByName} from "~/hook/useApps";

export default function Readme() {
  const {id} = useLocalSearchParams();
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);

  return (
    <View>
      <Markdown>
        {
          app?.long_description
        }
      </Markdown>
    </View>
  )
}
