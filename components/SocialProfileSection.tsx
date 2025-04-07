import {CardSectionBody, CardSectionContainer} from "~/components/PageSection";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import {View} from "react-native";
import {ListContentContainer} from "~/components/ListContentContainer";
import {getSocialAccountHandle} from "~/lib/utils";
import {Link} from "expo-router";
import {Text} from "~/components/ui/text";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {BRAND_COLOR_MAP} from "~/lib/constants";

interface I_Props {
  userData: any;
  socialSitesList: string[];
  linkUrl?: string;
}

export const SocialProfileSection = ({userData, socialSitesList, linkUrl}: I_Props) => {
  const socialAccountKeys: string[] = userData?.social_account_dict ? Object.keys(userData?.social_account_dict) : [];
  const hasDefinedSocialAccounts = socialSitesList?.filter(item => socialAccountKeys.includes(item)).length > 0;

  return (
    <CardSectionContainer>
      <CardHeaderLink headerTitle={"Social Profile"} linkUrl={linkUrl} hideArrow={!linkUrl}/>
      <CardSectionBody className={"space-y-4 px-4"}>
        <View>
          {
            hasDefinedSocialAccounts
              ? socialSitesList?.map((socialSite, index) => {
                if (userData?.social_account_dict[socialSite]) {
                  return (
                    <View key={index} className={"dark:color-whitesmoke"}>
                      <ListContentContainer
                        // icon={<span className={`fab fa-${socialSite} text-xl ${BRAND_COLOR_MAP[socialSite]}`}></span>}
                        icon={<FontAwesomeIcon icon={`fab fa-${socialSite}`} size={16} color={BRAND_COLOR_MAP[socialSite]} />}
                        classes={"group hover:bg-base-200 hover:rounded-xl"}
                        title={socialSite}
                        body={
                          <Link
                            href={userData?.social_account_dict[socialSite]}
                            target={"_blank"}
                            rel="noreferrer"
                            className={"group-hover:underline pad-l4 pad-y1 font-semibold color-initial dark:color-darkgray"}
                          >
                            <Text>
                              @{getSocialAccountHandle(userData?.social_account_dict[socialSite])}
                            </Text>
                          </Link>
                        }
                      >
                      </ListContentContainer>
                    </View>
                  )
                }
              })
              : <View className={"justify-center h-32"}>
                <Text className={"text-center color-gray"}>No account configured</Text>
              </View>
          }
        </View>
      </CardSectionBody>
    </CardSectionContainer>
  )
}
