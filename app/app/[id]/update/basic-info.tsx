import { ScrollView, TextInput, View } from "react-native";
import { NavHeaderLink } from "~/components/NavHeader";
import * as React from "react";
import { useState } from "react";
import { FormField, LabelField } from "~/components/Forms";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { toast } from "sonner-native";
import {useLocalSearchParams} from "expo-router";
import {useGetAppByName} from "~/hook/useApps";

interface AppData {
  name?: string;
  description?: string;
  version?: string;
  website?: string;
}

export default function AppBasicInfo() {
  const {id} = useLocalSearchParams()
  const {data: app, isLoading: appLoading, error: appError} = useGetAppByName(id as string);
  const [updateAppBasicInfoData, setUpdateAppBasicInfoData] = useState<AppData>({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = ({target: {name, value}}: { target: { name: string; value: string } }) => {
    setUpdateAppBasicInfoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showLoadingState = async () => {
    try {
      setIsSubmit(true);
      // Add your API call here to update the app info
      // const response = await fetch('/api/updateApp', {...})

      toast.success('App info updated successfully');
    } catch (error) {
      console.error('Error updating app info:', error);
      toast.error('Failed to update app info');
    } finally {
      setIsSubmit(false);
    }
  };


  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Update Basic info"/>

      <ScrollView className="flex-1 bg-white dark:bg-[#111314]">
        <View className="p-4 space-y-6">
          <FormField>
            <LabelField text="App name">
              <TextInput
                className="h-16 px-5 bg-base-100 dark:bg-base native:rounded-2xl font-bold"
                placeholder="Your app name"
                defaultValue={app?.name}
                onChangeText={(text) => handleChange({target: {name: 'name', value: text}})}
              />
            </LabelField>
          </FormField>

          <FormField>
            <LabelField text="Description">
              <TextInput
                className="h-32 px-5 py-6 bg-base-100 dark:bg-[#222425] native:rounded-2xl font-bold"
                multiline
                numberOfLines={4}
                placeholder="Write about your app in few words."
                defaultValue={app?.description}
                onChangeText={(text) => handleChange({target: {name: 'description', value: text}})}
                maxLength={120}
                textAlignVertical={"top"}
              />
            </LabelField>
          </FormField>

          <FormField>
            <LabelField text="Version">
              <TextInput
                className="h-16 px-5 bg-base-100 dark:bg-[#222425] rounded-2xl font-bold"
                placeholder="Your app's version"
                defaultValue={app?.version}
                onChangeText={(text) => handleChange({target: {name: 'version', value: text}})}
              />
            </LabelField>
          </FormField>

          <FormField>
            <LabelField text="App website">
              <TextInput
                className="h-16 px-5 bg-base-100 dark:bg-[#222425] rounded-2xl font-bold"
                placeholder="Your app's website or landing page"
                defaultValue={app?.website}
                onChangeText={(text) => handleChange({target: {name: 'website', value: text}})}
              />
            </LabelField>
          </FormField>
        </View>
      </ScrollView>

      <View className="p-4 bg-white dark:bg-[#111314]">
        <Button
          onPress={showLoadingState}
          disabled={!updateAppBasicInfoData?.name && !updateAppBasicInfoData?.description && !updateAppBasicInfoData?.version && !updateAppBasicInfoData?.website}
          className="w-72 mx-auto rounded-xl bg-nine"
        >
          <Text>{isSubmit ? 'Saving...' : 'Save'}</Text>
        </Button>
      </View>
    </View>
  );
}
