import {CardSectionBody, CardSectionContainer} from "~/components/PageSection";
import {CardHeaderLink} from "~/components/CardHeaderLink";
import {BasicGridAppBoxes} from "~/components/cards/AppCard";
import {ScrollView, View} from "react-native";
import {Text} from "~/components/ui/text";
import {LucideEye, LucideStar} from "lucide-react-native";

interface I_Props {
  userData: any;
  userApps: any;
  userId: string;
  linkUrl: string;
  headerTitle?: string;
}

export const AppsSection = ({userData, userApps, userId, linkUrl, headerTitle}: I_Props) => {

  return (
    <CardSectionContainer>
      <CardHeaderLink
        linkUrl={linkUrl}
        headerTitle={"Your projects"}
      />
      {/*{
        userId === user?.id
          ? <CardHeaderLink
            linkUrl={linkUrl}
            headerTitle={"Your projects"}
          />
          : <CardHeaderLink
            linkUrl={linkUrl}
            headerTitle={headerTitle!}
          />
      }*/}

      <CardSectionBody className={"gap-y-4 px-0"}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={""}
        >
          <View className={"flex flex-row flex-nowrap justify-start items-start overflow-x-auto mx-2"}>
            {
              userApps?.length > 0
                ? userApps?.map((eachUserApps: any, index: number) => (
                    index < 6 &&
                    <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} />
                  )
                )
                : <Text className={"mx-auto my-2 p-4 text-lg text-center font-semibold color-gray"}>
                  No apps yet
                </Text>
            }
          </View>
        </ScrollView>

        <View>
          {
            userData?.clicks > 0
            && <View className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
                  <View className={""}>
                      <View className={""}>
                        {/*<span className={"fa fa-eye square-4 lh-4 text-center color-999"}></span>*/}
                          <LucideEye/>
                          <Text>144 views</Text>
                      </View>
                    {/*<span className={"pad-l4 pad-y1"}>{userData?.phone_no || <NotDefined />}</span>*/}
                  </View>
                  <View className={""}>
                      <View className={""}>
                        {/*<span className={"fa fa-smile square-4 lh-4 text-center color-999"}></span>*/}
                          <LucideStar/>
                          <Text>16 reactions (Likes, clap)</Text>
                      </View>
                    {/*<span className={"pad-l4 pad-y1"}>{userData?.country || <NotDefined />}</span>*/}
                  </View>
                  <View className={""}>
                      <View className={""}>
                        {/*<span className="fa fa-save square-4 lh-4 text-center color-999"></span>*/}
                          <Text>4 saves</Text>
                      </View>
                    {/*<span className={"pad-l4 pad-y1"}>{userData?.address || <NotDefined />}</span>*/}
                  </View>
                  <View className={""}>
                      <Text className={""}>
                        {/*<span className="fa fa-money square-4 lh-4 text-center color-999"></span>*/}
                          <Text>5 Donations (#6000)</Text>
                      </Text>
                    {/*<span className={"pad-l4 pad-y1"}>{new Date(userData?.date_joined).toLocaleDateString() || <NotDefined />}</span>*/}
                  </View>
              </View>
          }
        </View>
      </CardSectionBody>
    </CardSectionContainer>
  )
}
