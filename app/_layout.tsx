import '~/global.css';

import {DarkTheme, DefaultTheme, Theme, ThemeProvider} from '@react-navigation/native';
import {router, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import * as Notifications from 'expo-notifications';
import {Platform, View} from 'react-native';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {PortalHost} from '@rn-primitives/portal';
import {ThemeToggle} from '~/components/ThemeToggle';
import {setAndroidNavigationBar} from '~/lib/android-navigation-bar';

import {ClerkLoaded, ClerkProvider} from '@clerk/clerk-expo'
import {tokenCache} from "~/cache";
import ProfileDropDown from '~/components/ProfileDropdown';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Toaster} from "sonner-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import NineProvider from "~/contexts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";

library.add(fab, far, fas);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

function useNotificationObserver() {
  useIsomorphicLayoutEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();
  const hasMounted = React.useRef(false);
  const {colorScheme, isDarkColorScheme} = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [loaded, error] = useFonts({
    // 'Assistant-Regular': require('~/assets/fonts/Assistant-Regular.ttf'),
    // 'Assistant-Medium': require('~/assets/fonts/Assistant-Medium.ttf'),
    // 'Assistant-Light': require('~/assets/fonts/Assistant-Light.ttf'),
    // 'Assistant-ExtraLight': require('~/assets/fonts/Assistant-ExtraLight.ttf'),
    // 'Assistant-Bold': require('~/assets/fonts/Assistant-Bold.ttf'),
    // 'Assistant-SemiBold': require('~/assets/fonts/Assistant-SemiBold.ttf'),
    // 'Assistant-ExtraBold': require('~/assets/fonts/Assistant-ExtraBold.ttf'),
    'Assistant-Variable': require('~/assets/fonts/Assistant-VariableFont.ttf'),
  });

  // Configure notifications settings
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Request notification permissions.
  // Adding notification request here to request for permission once the app loads.
  async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync({
      android: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return status === 'granted';
  }

  const queryClient = new QueryClient();

  useIsomorphicLayoutEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!loaded && !error) {
    return null;
  }

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <NineProvider>
            <SafeAreaProvider>
              <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <GestureHandlerRootView>
                  <SafeAreaView
                    className={"flex-auto"}
                    edges={{bottom: 'maximum', top: 'maximum', left: 'off', right: 'off'}}
                    style={{backgroundColor: isDarkColorScheme ? DARK_THEME.colors.background : LIGHT_THEME.colors.background}}
                  >
                    <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
                    <Stack screenOptions={{headerShown: false}}>
                      <Stack.Screen
                        name='index'
                        options={{
                          title: 'Nine',
                          header: () => <View></View>,
                          headerTitleStyle: {
                            fontWeight: 'bold',
                          },
                          headerRight: () => <View>
                            <ThemeToggle/>
                            <ProfileDropDown/>
                          </View>,
                          headerShown: true,
                          headerShadowVisible: false,
                        }}
                      />
                      {/*<Stack.Screen name="(auth)" options={{headerShown: false}}/>*/}
                    </Stack>
                    <PortalHost />
                  </SafeAreaView>
                  <Toaster
                    position="top-center"
                    offset={120}
                    duration={4000}
                    swipeToDismissDirection="left"
                    visibleToasts={3}
                    closeButton
                    autoWiggleOnUpdate="toast-change"
                    theme="system"
                    // icons={{
                    //   error: <Text>💥</Text>,
                    //   loading: <Text>🔄</Text>,
                    // }}
                    toastOptions={{
                      actionButtonStyle: {
                        paddingHorizontal: 20,
                      },
                    }}
                    pauseWhenPageIsHidden
                  />
                  <PortalHost/>
                </GestureHandlerRootView>
              </ThemeProvider>
            </SafeAreaProvider>
          </NineProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
