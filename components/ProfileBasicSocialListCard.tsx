import {View} from "react-native";
import {Link} from "expo-router";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {BRAND_COLOR_MAP} from "~/lib/constants";
import {Button} from "~/components/ui/button";
import {getFormattedPhoneNumber} from "~/lib/utils";

export const ProfileBasicSocialListCard = ({userData, socialSitesList, brandColorMap}) => {
  const appSocialList = userData?.social_account_dict && socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0;

  return (
    <>
      {
        userData && appSocialList
        &&
          <View className={"flex flex-row justify-center lg:justify-start gap-x-8 md:gap-x-12 lg:gap-x-20 px-4"}>
              <View className={""}>
                  <Link
                      asChild
                      href={`mailto:${userData?.email}`}
                      target={"_blank"}
                      rel="noreferrer"
                      className={"bg-base-200 text-center rounded-xl font-semibold color-initial dark:color-darkgray"}
                  >
                      <Button
                          size={"icon"}
                          className={`justify-center items-center w-12 h-12 bg-base-100 hover:bg-base-200 rounded-2xl text-2xl`}>
                          <FontAwesomeIcon icon={`envelope`} size={16}/>
                      </Button>
                  </Link>
              </View>
              <View className={""}>
                  <Link
                      asChild
                      href={`tel:${getFormattedPhoneNumber(userData)}`}
                      target={"_blank"}
                      rel="noreferrer"
                      className={"bg-base-200 text-center rounded-xl font-semibold color-initial dark:color-darkgray"}
                  >
                      <Button
                          size={"icon"}
                          className={`justify-center items-center w-12 h-12 bg-base-100 hover:bg-base-200 rounded-2xl text-2xl`}>
                          <FontAwesomeIcon icon={`phone`} size={16} color={"mediumseagreen"}/>
                      </Button>
                  </Link>
              </View>
            {
              socialSitesList?.map((socialSite, index) => {
                if (userData?.social_account_dict[socialSite]) {
                  return (
                    <View key={index} className={"l:w-32"}>
                      <Link asChild href={userData?.social_account_dict[socialSite]}
                            target={"_blank"}
                            rel="noreferrer"
                            className={"bg-base-200 text-center rounded-xl font-semibold color-initial dark:color-darkgray"}
                      >
                        {/*<View
                          className={"lg:tooltip lg:tooltip-bottom lg:tooltip-info"}
                          data-tip={`@${getSocialAccountHandle(userData?.social_account_dict[socialSite])}`}
                        >
                        </View>*/}
                        <Button
                          size={"icon"}
                          className={`justify-center items-center w-12 h-12 bg-base-100 hover:bg-base-200 rounded-2xl text-2xl`}>
                          <FontAwesomeIcon icon={`fab fa-${socialSite}`} size={16} color={BRAND_COLOR_MAP[socialSite]}/>
                        </Button>
                      </Link>
                    </View>
                  )
                }
              })
            }
          </View>
      }
    </>
  )
}
