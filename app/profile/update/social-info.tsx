import {ScrollView, TextInput, View} from "react-native";
import {NavHeaderLink} from "~/components/NavHeader";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {FormField} from "~/components/Forms";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {toast} from "sonner-native";
import {useUser} from "@clerk/clerk-expo";
import {useGetUserByUsername, useUpdateUser} from "~/hook/useNineUser";
import {useGetAppSocials} from "~/hook/useSocialList";
import {LoadingButton} from "~/components/LoadingButton";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {BRAND_COLOR_MAP} from "~/lib/constants";

interface SocialData {
  [key: string]: string;
}

export default function UpdateProfileSocialInfo() {
  const {user} = useUser();
  const {
    data: userDB,
    error: userError,
    isFetched: userFetched,
    isLoading: userLoading
  } = useGetUserByUsername(user?.username!);
  const {data: socialSitesList} = useGetAppSocials();
  const [updateProfileSocialInfoData, setUpdateProfileSocialInfoData] = useState<SocialData>(userDB?.social_account_dict);
  const updateUser = useUpdateUser();
  const [isSubmit, setIsSubmit] = useState(false);
  const socialInputsContainer = useRef(null);
  const moreSocialSitesContainer = useRef(null);
  const [profileSocialAccount, setProfileSocialAccount] = useState([]);
  const [profileSocialAccountDifference, setProfileSocialAccountDifference] = useState([]);
  const [appendedSocialSites, setAppendedSocialSites] = useState([]);
  const [visibleSocialAccount, setVisibleSocialAccount] = useState([]);
  const [socialSitesDict, setSocialSitesDict] = useState({});
  console.log("Appended social sites", visibleSocialAccount, profileSocialAccount, updateProfileSocialInfoData?.social_data);

  useEffect(() => {
    // Array.prototype.diff = function (arr2) { return this.filter(x => !arr2.includes(x)); }
    // [1, 2, 3].diff([2, 3])

    // Find the difference between the socialSitesList and the user defined profileSocialAccount list (array) and return the difference
    setProfileSocialAccountDifference(socialSitesList?.filter(x => !profileSocialAccount?.includes(x)).concat(profileSocialAccount?.filter(x => !socialSitesList.includes(x))))
    userDB?.social_account_dict && setProfileSocialAccount(Object.keys(userDB?.social_account_dict))
  }, [userDB, socialSitesList])

  useEffect(() => {
    if (Object.keys(profileSocialAccount).length === 0) {
      setVisibleSocialAccount(socialSitesList?.slice(0, 4))
    } else {
      const combinedSocialAccountList = profileSocialAccount.concat(profileSocialAccountDifference).slice(0, 5)
      setVisibleSocialAccount(combinedSocialAccountList)
    }
    // console.log(profileSocialAccountDifference)
    // console.log(profileSocialAccount)
  }, [profileSocialAccount, profileSocialAccountDifference, socialSitesList])

  const handleChange = ({target: {name, value}}: { target: { name: string; value: string } }) => {
    console.log(updateProfileSocialInfoData)
    setUpdateProfileSocialInfoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitSocialList = async () => {
    setIsSubmit(true);

    try {
      await updateUser.mutateAsync({
        username: user?.username as string,
        updates: {"social_account_dict": updateProfileSocialInfoData}
      });

      toast.success("Social info updated successfully.");
    } catch (error) {
      console.error("Error updating social info", error.message);
      toast.error("Error updating social info. Try again soon.");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleSocialSiteSelect = (event: any) => {
    // console.log("handle event", event);
    const socialName = event.target.name.toString();
    const socialDict = {}
    socialDict[socialName] = event.target.value;
    setSocialSitesDict({...socialSitesDict, ...socialDict});
  };

  const addSocialInput = (iconName) => {
    // setClickedButton(iconName);
    // console.log(iconName)
    // console.log(socialInputsContainer.current)
    // socialInputsContainer.current.appendChild(socialInputs(iconName));
    // console.log(socialInputsContainer.current.childNodes?.length);
    if (appendedSocialSites.includes(iconName)) {
      setAppendedSocialSites(appendedSocialSites);
      // setVisibleSocialSites(appendedSocialSites);
    } else {
      setAppendedSocialSites([...appendedSocialSites, iconName]);
    }
    setVisibleSocialAccount([iconName, ...visibleSocialAccount]);
  }

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Update social info"/>

      <ScrollView className="flex-1 bg-white dark:bg-[#111314]">
        <View className="p-4">
          <View className={"every:flex|flex-col|mg-y1|pad-2|font-14"} ref={socialInputsContainer}>
            {/*
                        Show the four most important social media links first.
                        * Linkedin
                        * github
                        * stackoverflow
                        * youtube
                        * medium
                        */}
            {/* {console.log(userDataResults?.social_account_dict)} */}
            {/* {userDataResults?.social_account_dict && Object.keys(userDataResults?.social_account_dict)?.length} - ABC */}
            {/* {profileSocialAccount?.length} - DEF */}
            {/* {
                            profileSocialAccount?.map((eachSocialAccount, index) => {
                                if (Object.keys(userDataResults?.social_account_dict)?.length > 0) {
                                    return (
                                        <div key={eachSocialAccount.trim()} className={""}>
                                            <span className={""}>
                                                <span className={`fab fa-${eachSocialAccount.trim()} square-4 lh-4 text-center color-999`}></span>
                                                {eachSocialAccount.trim()}:
                                            </span>
                                            <input
                                                type="url"
                                                name={eachSocialAccount.trim()}
                                                defaultValue={userDataResults?.social_account_dict[eachSocialAccount]}
                                                // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                                // value={userDataResults?.phone_no}
                                                placeholder={`Your ${eachSocialAccount.trim()} link`}
                                                onChange={handleSocialSiteSelect}
                                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                                            />
                                        </div>
                                    );
                                };
                            })
                        } */}
            {/* {profileSocialAccountDifference?.length} - 123 */}
            {/* {profileSocialAccount} */}
            {/* <div></div> */}
            {/* {visibleSocialAccount} - GHI */}
            {
              // Find the difference between the socialSitesList and the user defined profileSocialAccount list (array) and return the difference
              // socialSitesList?.filter(x => !profileSocialAccount?.includes(x)).concat(profileSocialAccount?.filter(x => !socialSitesList.includes(x)))?.map((eachSocialSite, index) => {
              // profileSocialAccount?.length < 4
              // visibleSocialAccount?.length < 4
              visibleSocialAccount?.map((eachSocialSite, index) => {
                // ? socialSitesList?.map((eachSocialSite, index) => {
                // if (index < 4) {
                // if (userDataResults?.social_account_dict[eachSocialSite]) {
                return (
                  // appendedSocialSites.includes(eachSocialSite.trim()) && (
                  <View key={eachSocialSite} className={""}>
                    <FormField>
                      <View className={"flex flex-row items-center gap-x-2 py-2"}>
                        <Text
                          className={`${BRAND_COLOR_MAP[eachSocialSite]} w-8 leading-8 square-4 lh-4 text-lg text-center color-999`}>
                          <FontAwesomeIcon icon={`fab fa-${eachSocialSite}`} size={16} color={BRAND_COLOR_MAP[eachSocialSite]}/>
                        </Text>
                        <Text className={""}>{eachSocialSite}:</Text>
                      </View>
                      <TextInput
                        keyboardType="url"
                        className="h-16 px-5 bg-base-100 dark:bg-[#222425] native:rounded-2xl font-bold"
                        defaultValue={userDB?.social_account_dict ? userDB?.social_account_dict[eachSocialSite] : ""}
                        placeholder={`Your ${eachSocialSite} url`}
                        // onChange={handleSocialSiteSelect}
                        onChangeText={(text) => handleChange({target: {name: eachSocialSite, value: text}})}
                      />
                    </FormField>
                  </View>
                  // )
                );
              })
            }
          </View>
        </View>
      </ScrollView>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className={""}>
            {
              moreSocialSitesContainer?.current?.childNodes?.length > 0
              && <Text className={"px-4"}>
                    Add more
                </Text>
            }
            <View
              className={"flex flex-row flex-nowrap gap-x-2 p-4 bg-mica text-center overflow-x-auto every:flex|flex-column|align-items-center|w-120|max-w-120|flex-nogrow|flex-noshrink|mg-x1|mg-y1|pad-x1|pad-y2|cursor-pointer hover:every:bg-lighter dark:hover:every:bg-333435"}
              ref={moreSocialSitesContainer}>
              {
                profileSocialAccountDifference?.filter(x => !visibleSocialAccount?.includes(x))?.map((eachSocialSite, index) => {
                  const eachSocialSiteTrimmed = eachSocialSite?.trim();
                  return (
                    <Button
                      key={eachSocialSite}
                      className={"flex flex-row gap-x-3 w-32 shadow rounded-xl radius bg-base-300 dark:bg-222425|shadow-unset"}
                      data-icon-name={eachSocialSiteTrimmed}
                      onPress={() => addSocialInput(eachSocialSiteTrimmed)}
                    >
                      <FontAwesomeIcon icon={`fab fa-${eachSocialSiteTrimmed}`} />
                      <Text className={"pct:w-100 text-ellipsis text-base-content"}>{eachSocialSiteTrimmed.replace("-", "")}</Text>
                    </Button>
                  );
                })
              }
            </View>
          </View>
        </ScrollView>
      </View>

      <View className="p-4 bg-white dark:bg-[#111314]">
        <Button
          onPress={submitSocialList}
          disabled={userDB.social_account_dict === updateProfileSocialInfoData}
          className="w-72 mx-auto rounded-xl bg-nine"
        >
          <Text>{isSubmit ? <LoadingButton/> : 'Save'}</Text>
        </Button>
      </View>
    </View>
  );
}
