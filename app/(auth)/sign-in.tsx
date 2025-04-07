import React, {useCallback, useEffect} from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import {useSSO, useUser} from '@clerk/clerk-expo'
import {View} from 'react-native'
import {OAuthStrategy} from "@clerk/types";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {GithubIcon} from "~/assets/svgs/githubIcon";
import {Separator} from "~/components/ui/separator";
import {router} from "expo-router";
import {E_DBTables} from "~/types/enums";
import {useNineContext} from "~/contexts";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  useWarmUpBrowser()
  const {supabaseClient} = useNineContext();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const {startSSOFlow} = useSSO()

  const outhSignin = useCallback(async (provider: OAuthStrategy) => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const {createdSessionId, setActive, signIn, signUp, authSessionResult} = await startSSOFlow({
        strategy: provider,
        // Defaults to current path
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({session: createdSessionId})
        console.log("Actice session,", createdSessionId, authSessionResult);
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View className={"flex flex-col justify-center items-center gap-y-8 h-full"}>
      <View className={"self-center gap-y-2"}>
        <Text className={"text-center text-2xl font-medium"}>Nine</Text>
        <Text className="relative text-4xl font-black lh-normal decoration-none color-initial">Sign in</Text>
      </View>

      <View className={""}>
        <Button className={"flex flex-row items-center gap-x-2 rounded-xl"} onPress={() => outhSignin('oauth_github')}>
          <GithubIcon width={32} height={32} fill="#ffffff"/>
          <Text className={"font-bold text-lg"}>Sign in with Github</Text>
        </Button>
        {/*<Button title="Sign in with Google" onPress={() => onPress('oauth_google')} />*/}
        {/*<Button title="Sign in with Github" onPress={() => onPress('oauth_github')} />*/}
      </View>

      <View className={"absolute bottom-8 w-full"}>
        <Separator className='mx-auto my-4 w-8/12' />
        <Button variant={"link"} onPress={() => {router.replace("/")}}>
          <Text className={"font-bold text-2xl text-center underline underline-offset-2"}>Back to home</Text>
        </Button>
      </View>
    </View>
  )
}
