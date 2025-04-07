import {ScrollView, TextInput, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import {LabelField} from "~/components/Forms";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import * as React from "react";
import {useState} from "react";
import {LoadingButton} from "~/components/LoadingButton";
import {useLocalSearchParams} from "expo-router";
import {useGetAppByName} from "~/hook/useApps";
import {LucideInfo} from "lucide-react-native";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";

export default function DeleteApp() {
  const {id} = useLocalSearchParams()
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const [appName, setAppName] = useState(app?.name);
  const [isSubmit, setIsSubmit] = useState(false);

  const showLoadingState = async () => {
    setIsSubmit(true);
    try {
      // Add your delete API call here
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <NavHeaderLink headerTitle={"Remove " + app.name}/>

      <ScrollView style={{flex: 1}}>
        <View className="w-11/12 gap-y-16 mx-auto my-4">
          <View className="gap-y-6 p-4 rounded-xl">
            {/*<Alert icon={LucideInfo} className='max-w-xl border-0 bg-error rounded-xl'>
              <AlertTitle className={"font-bold text-white"}>Heads up!</AlertTitle>
              <AlertDescription className={"text-base text-white"}>
                This action is irreversible. You will lose all data linked with {app.name} on Nine.
              </AlertDescription>
            </Alert>*/}
            <Text className="font-bold text-lg">Heads up...</Text>
            <Text className="text-lg">If you choose to proceed,</Text>
            <View className="gap-y-4 pl-5">
              <View className="flex-row">
                <Text className="mr-1">1.</Text>
                <Text className="flex-1">
                  No one will see {app.name} on Nine once you remove it.
                </Text>
              </View>
              <View className="flex-row">
                <Text className="mr-1">2.</Text>
                <Text className="flex-1">
                  But you can always add it from your repo whenever you choose to.
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-y-4">
            <Text className="text-center dark:text-error-content">
              Type <Text className="font-bold">{app?.name}</Text> below to remove from Nine.
            </Text>

              <TextInput
                className="h-20 px-5 bg-base-100 dark:bg-base-200 native:rounded-2xl"
                placeholder={`Type ${app?.name} here`}
                value={appName}
                onChangeText={setAppName}
                autoCapitalize="none"
              />

            <View className="py-4">
              <Button
                onPress={showLoadingState}
                disabled={appName !== app?.name}
                className="w-72 mx-auto rounded-xl bg-error"
              >
                <Text className="text-white">
                  {isSubmit ? <LoadingButton/> : "Delete"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
