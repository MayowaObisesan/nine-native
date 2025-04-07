import {ListContentContainer} from "~/components/ListContentContainer";
import {CardSectionBody, CardSectionContainer} from "~/components/PageSection";
import {Text} from "~/components/ui/text";
import {LucideCalendarPlus, LucideFlag, LucideMapPin, LucidePhone} from "lucide-react-native";
import {Link} from "expo-router";
import {LUCIDE_ICON_THEME_COLOR} from "~/lib/constants";
import {useColorScheme} from "~/lib/useColorScheme";

export const PersonalDetailsSection = ({userData, linkUrl}: { userData: any; linkUrl?: string }) => {
  const {colorScheme} = useColorScheme()

  return (
    <CardSectionContainer>
      {/*<CardHeaderLink
        linkUrl={linkUrl}
        headerTitle={"Personal Details"}
        hideArrow
      />*/}
      <CardSectionBody className={"gap-y-2 px-4"}>
        <ListContentContainer
          title={<Text className="font-normal text-base">{"About me"}</Text>}
          classes={""}
        >
          {
            userData?.bio &&
              <Text className={"font-medium text-base"}>
                {userData?.bio}
              </Text>
          }
        </ListContentContainer>

        <ListContentContainer
          icon={<LucidePhone size={20} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>}
          classes={"group hover:bg-base-200 hover:rounded-xl"}
          title={"Mobile"}
          body={
            <Link
              href={`tel:${"+" + userData?.country_data?.callingCode[0] + userData?.phone_no}`}
              className={"font-bold underline text-lg"}
            >
              {"+" + userData?.country_data?.callingCode[0] + userData?.phone_no || "-"}
            </Link>
          }
        >
        </ListContentContainer>

        <ListContentContainer
          icon={<LucideMapPin size={20} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>}
          classes={"hover:bg-base-200 hover:rounded-xl"}
          title={"Address"}
          body={<Text className={"font-bold"}>{userData?.address}</Text>}
        />

        <ListContentContainer
          icon={<LucideFlag size={20} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>}
          title={"Country"}
          body={<Text className={"font-bold"}>{userData?.country_data?.name}</Text>}
        />

        <ListContentContainer
          icon={<LucideCalendarPlus size={20} color={LUCIDE_ICON_THEME_COLOR[colorScheme]}/>}
          title={"Date Joined"}
        >
          <Text
            className={"text-lg font-bold"}>{new Date(userData?.created_at || userData?.createdAt).toDateString() || "-"}</Text>
        </ListContentContainer>
      </CardSectionBody>
    </CardSectionContainer>
  )
}
