import {useClerk} from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {LucidePowerOff} from "lucide-react-native";

export const SignOutButton = () => {
  const {signOut} = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return <Button size={"sm"} variant={"destructive"} onPress={handleSignOut} className={"flex-row justify-between gap-x-2 w-full h-10 bg-error rounded-xl"}>
    <Text className={"font-semibold"}>Sign out</Text>
    <FontAwesomeIcon icon={'power-off'} size={16} color={"white"}/>
  </Button>
}
