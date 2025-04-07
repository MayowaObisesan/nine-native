import React, {createContext, useContext, useEffect, useState} from 'react';
import * as SecureStore from "expo-secure-store";
import {useSession} from "@clerk/clerk-expo";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {isJsonString} from "~/lib/utils";
import {useIsomorphicLayoutEffect} from "@rn-primitives/hooks";
import {E_DBTables} from "~/types/enums";
import {supabase} from "~/lib/supabase";
import {useGetLatestApps, useGetUserApps} from "~/hook/useApps";
import * as Notifications from "expo-notifications";

const ACCOUNT_STORE_KEY = "SECURE_ACCOUNT_STORE_KEY";

interface I_WalletContext {
  // accounts: I_Account[]
  // setAccounts: React.Dispatch<React.SetStateAction<any[] | []>>
  readonly supabaseClient: any
  myApps: any[]
  latestApps: any[]
  scheduleNotification: any
}

export const NineContext = createContext<I_WalletContext>({
  supabaseClient: null,
  myApps: [],
  latestApps: [],
  // account: {
  //   address: '',
  //   publicKey: '',
  //   privateKey: ''
  // },
  // setAccount: () => {
  // },
  scheduleNotification: null,
} as const);

const saveAccountsToStore = async (data: string) => {
  try {
    await SecureStore.setItemAsync(ACCOUNT_STORE_KEY, data, {
      requireAuthentication: true,
      authenticationPrompt: "Confirm you want to do this",
    });
    console.log('Data stored successfully.');
    return true;
  } catch (error: any) {
    console.error('Failed to store data:', error);
    // Handle the case where authentication fails
    if (error.message.includes('User canceled')) {
      console.warn('User canceled authentication. Data was not stored.');
    } else {
      console.warn('Authentication failed for another reason.');
    }
    return false;
  }
}

const loadAccountsFromStore = () => {
  const accountDataString = SecureStore.getItem(ACCOUNT_STORE_KEY, {
    requireAuthentication: false,
    keychainService: "no-service"
  });
  // console.log("Accounts from store", accountDataString);

  if (accountDataString) {
    return isJsonString(accountDataString!) ? JSON.parse(accountDataString) : null;
  }

  return null;
}

const loadAccountsFromStoreAsync = async () => {
  const accountDataString = await SecureStore.getItemAsync(ACCOUNT_STORE_KEY);
  // console.log("Accounts from store async", accountDataString);

  if (accountDataString) {
    return isJsonString(accountDataString!) ? JSON.parse(accountDataString) : null;
  }

  return null;
}

// Function to delete the stored account
const deleteAccountsFromStore = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCOUNT_STORE_KEY);
    console.log('Account data deleted successfully.');
  } catch (error) {
    console.error('Failed to delete account data:', error);
  }
};

export function NineProvider({children}: { children: React.ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient>();
  // The `useSession()` hook will be used to get the Clerk session object
  const {isLoaded, isSignedIn, session} = useSession()
  const [myApps, setMyApps] = useState<any[]>([]);
  // const [latestApps, setLatestApps] = useState<any[]>([]);
  const {
    data: latestApps,
    error: userAppsError,
    isLoading: userAppsLoading,
    isFetched: userAppsFetched
  } = useGetLatestApps();

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            })

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      },
    )
  }

  useIsomorphicLayoutEffect(() => {
    // Create a `client` object for accessing Supabase data using the Clerk token
    const client = createClerkSupabaseClient()
    setSupabaseClient(client);

    async function fetchMyApps() {
      const {data, error} = await client
        .from(E_DBTables.Apps)
        .select("*")
        .eq("owner", session?.user?.primaryEmailAddress?.emailAddress);

      if (error) {
        console.error("error fetching my apps", error);
      }

      if (data && data.length > 0) {
        setMyApps(data);
      }
    }

    /*async function fetchLatestApps() {
      const {data, error} = await supabase
        .from(E_DBTables.Apps)
        .select("*")
        // .order("created_at", {ascending: false})
        // .range(0, 9);

      if (error) {
        console.error("error fetching latest apps", error);
      }

      if (data && data.length > 0) {
        setLatestApps(data);
      }
    }*/
    if (isSignedIn) {
      fetchMyApps();
    }
    // fetchLatestApps();
  }, []);

  useEffect(() => {
    const lazyLoadAccountsFromStoreAsync = async () => {
      const accountsFromStore = await loadAccountsFromStoreAsync();
    }

    lazyLoadAccountsFromStoreAsync();
  }, []);

  // Schedule a local notification
  async function scheduleNotification(title: string, body: string, channelId?: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { url: 'your-deep-link-url' }, // Optional: Add deep linking
      },
      trigger: {
        seconds: 1, // Notification appears after 1 second
        // Or use a date
        // date: new Date(Date.now() + 60 * 1000), // Notification appears after 60 seconds
        channelId: channelId,
      },
    });
  }

  async function registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID
    })).data;

    return token;
  }

  /*// Usage example:
  await scheduleNotification(
    'Hello!',
    'This is a notification from Nine'
  );*/

  const createAccount = async () => {
    try {
      // console.log("Before save to store", accounts, typeof _newAccount);

      // const isSaved = await saveAccountsToStore(
      //   accounts
      //     ? JSON.stringify([...accounts, _newAccount])
      //     : JSON.stringify([_newAccount]) // for a new wallet creation. This means account is not created
      // );
      // console.log("After save to store")


      // if (isSaved) {
      //   console.log("ACCOUNTS IN STORE", SecureStore.getItem(ACCOUNT_STORE_KEY));
      //   setAccounts([...(accounts || []), _newAccount]);
      //   setAccount(_newAccount);
      //   setPrivateKey(encryptedKey) // store only encrypted key
      //
      //   // Save the accounts to store, including when the accounts are created.
      //   console.log(accounts)
      // }
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  }

  const deleteAccount = async () => {
    await SecureStore.deleteItemAsync(ACCOUNT_STORE_KEY);
  }

  const contextValues = {
    supabaseClient,
    myApps,
    latestApps,
    scheduleNotification,
  }

  return <NineContext.Provider value={contextValues}>{children}</NineContext.Provider>;
}

export const useNineContext = () => useContext(NineContext);
export default NineProvider;
