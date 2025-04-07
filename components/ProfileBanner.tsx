import {View} from "react-native";
import {ProfileBasicDetailsCard} from "~/components/ProfileBasicDetailsCard";
import {ListContentContainer} from "~/components/ListContentContainer";
import {ProfileBasicSocialListCard} from "~/components/ProfileBasicSocialListCard";
import {BRAND_COLOR_MAP} from "~/lib/constants";
import {ProfileBannerAbstractCard} from "~/components/ProfileBannerAbstractCard";
import {Text} from "~/components/ui/text";

export const ProfileBanner = ({userData, socialSitesList, userApps, removeAbout, removeSocial}) => {
  return (
    <View
      className={"relative flex flex-row justify-center lg:justify-start items-center w-full mx-auto bg-base-100 bg-gradient-to-r from-white dark:from-base-300 to-base-100 dark:to-base-200 to 80% h-[540px] md:h-[600px] lg:h-[720px] py-16 overflow-hidden dark:bg-000304"}>
      {/*Profile Page*/}
      <View
        className={"relative w-full lg:w-auto lg:min-w-[56%] bg-transparent backdrop-blur-sm rounded-2xl p-4 lg:p-8 space-y-8 lg:left-12 z-[1] overflow-clip"}>
        {/* Profile banner - Names Card */}
        {/*<ProfileBasicDetailsCard userData={userData}/>*/}

        {/* Profile Banner - About me container */}
        {
          !removeAbout
          && <View>
                <ListContentContainer
                    title={<div className="font-bold">{"About me"}</div>}
                    classes={""}
                >
                    <Text className={"font-medium text-xl"}>{userData?.about_me}</Text>
                </ListContentContainer>
            </View>
        }

        {/* Profile Banner - Social lists */}
        {
          !removeSocial
          && <ProfileBasicSocialListCard
                userData={userData}
                socialSitesList={socialSitesList}
                brandColorMap={BRAND_COLOR_MAP}
            />
        }
      </View>

      {/* Profile abstract cards */}
      <ProfileBannerAbstractCard userData={userData} userApps={userApps}/>
    </View>
  )
}
