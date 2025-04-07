import {ScrollView, TextInput, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import * as React from "react";
import {useState} from "react";
import {FormField, LabelField} from "~/components/Forms";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {toast} from "sonner-native";
import {useUser} from "@clerk/clerk-expo";
import {useGetUserByUsername, useUpdateUser} from "~/hook/useNineUser";
import PhoneInput from "react-native-phone-number-input";
import {LoadingButton} from "~/components/LoadingButton";

interface AppData {
  phone_no?: string;
  bio?: string;
  address?: string;
  country?: string;
}

export default function UpdateProfileBasicInfo() {
  const {user} = useUser();
  const {
    data: userDB,
    error: userError,
    isFetched: userFetched,
    isLoading: userLoading
  } = useGetUserByUsername(user?.username!);
  const [updateProfileBasicInfoData, setUpdateProfileBasicInfoData] = useState<AppData>({});
  const updateUser = useUpdateUser();
  const [isSubmit, setIsSubmit] = useState(false);

  // ref and state for phone number
  const phoneInput = React.useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState(userDB?.phone_no || '');


  const handleChange = ({target: {name, value}}: { target: { name: string; value: string } }) => {
    setUpdateProfileBasicInfoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showLoadingState = async () => {
    setIsSubmit(true);

    try {
      await updateUser.mutateAsync({
        username: user?.username as string,
        updates: updateProfileBasicInfoData
      });

      toast.success("Profile info updated successfully.");
    } catch (error) {
      console.error("Error updating profile info", error.message);
      toast.error("Error updating profile info. Try again soon.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Update basic info"/>

      <ScrollView className="flex-1 bg-white dark:bg-[#111314]">
        <View className="p-4 space-y-6">
          <FormField>
            <LabelField text="About me">
              <TextInput
                className="h-32 px-5 py-6 bg-base-100 dark:bg-[#222425] native:rounded-2xl font-bold"
                multiline
                numberOfLines={4}
                placeholder="Write about yourself."
                defaultValue={userDB?.bio}
                onChangeText={(text) => handleChange({target: {name: 'bio', value: text}})}
                maxLength={120}
                textAlignVertical={"top"}
              />
            </LabelField>
          </FormField>

          {/*// Replace the TextInput with this*/}
          <FormField>
            <LabelField text="Mobile">
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode={userDB?.country_data?.cca2 || "US"} // Change this to your default country code
                layout="first"
                codeTextStyle={{
                  fontWeight: "bold"
                }}
                textInputStyle={{
                  fontWeight: "bold"
                }}
                containerStyle={{
                  width: '100%',
                  borderRadius: 16,
                  backgroundColor: 'white',
                  // shadowColor: '#f3f4f6',
                  borderWidth: 0,
                  columnGap: 4,
                }}
                textContainerStyle={{
                  borderRadius: 16,
                  backgroundColor: '#f3f4f6',
                  paddingVertical: 8
                }}
                countryPickerButtonStyle={{
                  borderRadius: 16,
                  backgroundColor: '#f3f4f6',
                }}
                onChangeCountry={(text) => {
                  handleChange({target: {name: 'country_data', value: text}})
                }}
                onChangeText={(text) => {
                  handleChange({target: {name: 'phone_no', value: text}});
                }}
                withDarkTheme
                withShadow={false}
                autoFocus={false}
              />
            </LabelField>
          </FormField>

          <FormField>
            <LabelField text="Address">
              <TextInput
                className="h-32 px-5 py-6 bg-base-100 dark:bg-[#222425] native:rounded-2xl font-bold"
                multiline
                numberOfLines={4}
                placeholder="Your location or address."
                defaultValue={userDB?.address}
                onChangeText={(text) => handleChange({target: {name: 'address', value: text}})}
                maxLength={120}
                textAlignVertical={"top"}
              />
            </LabelField>
          </FormField>

          <FormField>
            <LabelField text="Country">
              <TextInput
                className="h-16 px-5 bg-base-200 dark:bg-[#222425] rounded-2xl font-bold opacity-40"
                placeholder="Country"
                defaultValue={userDB?.country_data?.name}
                onChangeText={(text) => handleChange({target: {name: 'country', value: text}})}
                editable={false}
                readOnly={true}
              />
            </LabelField>
          </FormField>
        </View>
      </ScrollView>

      <View className="p-4 bg-white dark:bg-[#111314]">
        <Button
          onPress={showLoadingState}
          disabled={isSubmit || !updateProfileBasicInfoData?.phone_no && !updateProfileBasicInfoData?.bio && !updateProfileBasicInfoData?.address && !updateProfileBasicInfoData?.country}
          className="w-72 mx-auto rounded-xl bg-nine"
        >
          <Text>{isSubmit ? <LoadingButton text={'Saving...'} /> : 'Save'}</Text>
        </Button>
      </View>
    </View>
  );
}
