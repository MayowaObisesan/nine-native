import * as React from 'react';
import {FlatList, Pressable, View} from 'react-native';
import {Button} from '~/components/ui/button';
import {Text} from '~/components/ui/text';
import {Link, router} from "expo-router";
import {useColorScheme} from "~/lib/useColorScheme";
import HomeCarousel from "~/components/HomeCarousel";
import ParallaxScrollView from "~/components/ParallaxScrollView";
import Navbar from "~/components/Navbar";
import {toast} from "sonner-native";
import {useNineContext} from "~/contexts";
import {E_DBTables} from "~/types/enums";
import {useSession, useUser} from "@clerk/clerk-expo";
import {Separator} from "~/components/ui/separator";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {ListAppCard} from "~/components/cards/AppCard";
import {supabase} from "~/lib/supabase";

const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

const AppCard = React.memo(({app}: { app: any }) => (
  <Pressable
    style={({pressed}) => [
      // styles.card,
      {opacity: pressed ? 0.9 : 1}
    ]}
    onPress={() => router.push('app/' + app?.name)}
    className={"flex flex-row items-start gap-4 px-2 py-1 max-w-full border-0 rounded-xl"}
  >
    <View>
      <Text className={"text-xl"}>{app?.name}</Text>
      <Text className={"text-base"}>{app?.description}</Text>
    </View>
  </Pressable>
))

export default function Screen() {
  const {latestApps, supabaseClient} = useNineContext();
  const {isDarkColorScheme} = useColorScheme();
  const [progress, setProgress] = React.useState(78);
  const {isLoaded, isSignedIn, session} = useSession();
  const {user} = useUser();

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }

  supabase
    .channel('nine_app')
    .on('postgres_changes', { event: '*', schema: 'public', table: E_DBTables.Apps }, payload => {
      console.log('Change received!', payload)
      if (payload.eventType === "UPDATE") {

      }
    })
    .subscribe()

  // Listen for user SIGNIN event
  if (supabaseClient) {
    // console.log("supabaseClient EXIST");
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("AUTH CHANGE DETECTED", event, session);
      if (event === "SIGNED_IN") {
        // console.log("SIGNED_IN", session);
        // Create the User table instance here.
        const {data, error} = await supabaseClient
          .from(E_DBTables.User)
          .select("*")
          .eq("user_id", session?.user.id);

        if (error) {
          console.error("listen to signin event", error);
        }

        if (data && data.length === 0) {
          /*await supabaseClient.from(E_DBTables.User).insert([
            {
              bio: "",
              email: session?.user.email,
              userId: session?.user.id,
              userData: session?.user
            }
          ]);*/
          console.log("auth change data:", data)
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("USER HAS SIGNED_OUT. Please do come again. Thank you.");
        toast("Please do come again. Thank you. 🙂");
      }
    });

    async function getOrCreateUser() {
      // Create the User table instance here if the user doesn't exist.
      const {data, error} = await supabase
        .from(E_DBTables.User)
        .select("*")
        .eq("user_id", session?.user.id);

      if (error) {
        console.error("error connecting to DB", error);
      }

      if (data && data.length === 0) {
        const {data: createUserData, error: createUserError} = await supabaseClient
          .from(E_DBTables.User)
          .insert([
            {
              last_login: user?.lastSignInAt,
              email: session?.user.primaryEmailAddress?.emailAddress,
              dp: user?.imageUrl,
              phone_no: user?.primaryPhoneNumber?.phoneNumber,
              firstname: user?.firstName,
              lastname: user?.lastName,
              username: user?.username,
              is_verified: true,
              is_registered: true,
              is_active: true,
              created_at: user?.createdAt,
            }
          ])
          .select();

        if (createUserError) {
          console.error("error creating user", createUserError);
          throw new Error("Error creating user");
        }

        if (createUserData.length > 0) {
          //  Redirect to the select a repository page to create your apps from your github repos.
          router.push("/(auth)/select-repo");
        }
      }
    }

    if (isLoaded && isSignedIn && supabaseClient) {
      getOrCreateUser()
    }
  }

  const MemoizedAppCard = React.memo(ListAppCard);

  const renderItem = React.useCallback(({item, index}) => (
    <View className={""}>
      {/*{index > 0 && <Separator className='mx-auto my-1.5 w-full'/>}*/}
      <MemoizedAppCard
        app={item}
        // onPress={() => onRepoSelect(item)}
      />
    </View>
  ), []);


  return (
    <View
      className='flex-1 justify-start items-center bg-secondary/30'>
      {/* Navbar */}
      <Navbar/>
      <ParallaxScrollView
        headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
        headerImage={<HomeCarousel/>}
      >
        <View className={"p-5 gap-8"}>
          <Text className={"font-semibold text-xl"}>Latest Projects</Text>
          <Link href={"/notif_test"}>Notif Test page</Link>

          <FlatList
            data={latestApps}
            keyExtractor={item => item.name}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text className={"text-xl"}>No Apps yet.</Text>
            }
            contentContainerClassName={"flex-auto gap-y-8"}
            // ItemSeparatorComponent={() => <Separator className='w-11/12 mx-auto my-4 bg-base-100'/>}
          />

          {/*<Link href={"/feedback"}>Send Feedback</Link>*/}

          {/*<Card className='w-full max-w-sm p-6 rounded-2xl'>
            <CardHeader className='items-center'>
              <Avatar alt="Rick Sanchez's Avatar" className='w-24 h-24'>
                <AvatarImage source={{uri: GITHUB_AVATAR_URI}}/>
                <AvatarFallback>
                  <Text>RS</Text>
                </AvatarFallback>
              </Avatar>
              <View className='p-3'/>
              <CardTitle className='pb-2 text-center'>Rick Sanchez</CardTitle>
              <View className='flex-row'>
                <CardDescription className='text-base font-semibold'>Scientist</CardDescription>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger className='px-2 pb-0.5 active:opacity-50'>
                    <Info size={14} strokeWidth={2.5} className='w-4 h-4 text-foreground/70'/>
                  </TooltipTrigger>
                  <TooltipContent className='py-2 px-4 shadow'>
                    <Text className='native:text-lg'>Freelance</Text>
                  </TooltipContent>
                </Tooltip>
              </View>
            </CardHeader>
            <CardContent>
              <View className='flex-row justify-around gap-3'>
                <View className='items-center'>
                  <Text className='text-sm text-muted-foreground'>Dimension</Text>
                  <Text className='text-xl font-semibold'>C-137</Text>
                </View>
                <View className='items-center'>
                  <Text className='text-sm text-muted-foreground'>Age</Text>
                  <Text className='text-xl font-semibold'>70</Text>
                </View>
                <View className='items-center'>
                  <Text className='text-sm text-muted-foreground'>Species</Text>
                  <Text className='text-xl font-semibold'>Human</Text>
                </View>
              </View>
            </CardContent>
            <CardFooter className='flex-col gap-3 pb-0'>
              <View className='flex-row items-center overflow-hidden'>
                <Text className='text-sm text-muted-foreground'>Productivity:</Text>
                <LayoutAnimationConfig skipEntering>
                  <Animated.View
                    key={progress}
                    entering={FadeInUp}
                    exiting={FadeOutDown}
                    className='w-11 items-center'
                  >
                    <Text className='text-sm font-bold text-sky-600'>{progress}%</Text>
                  </Animated.View>
                </LayoutAnimationConfig>
              </View>
              <Progress value={progress} className='h-2' indicatorClassName='bg-sky-600'/>
              <View/>
              <Button
                variant='outline'
                className='shadow shadow-foreground/5'
                onPress={updateProgressValue}
              >
                <Text>Update</Text>
              </Button>

              <Button variant='secondary' onPress={() => router.push("/(auth)/sign-in")}>
                <Text>Login</Text>
              </Button>
            </CardFooter>
          </Card>*/}
        </View>
      </ParallaxScrollView>

      <Button size={"default"} className={"absolute bottom-12 right-8 h-12 shadow"}>
        <Link href={"/(auth)/select-repo"}>
          <View className={"flex-row items-center gap-x-2"}>
            <FontAwesomeIcon icon={"plus"} color={"white"} />
            <Text>Add Project</Text>
          </View>
        </Link>
      </Button>
    </View>
  );
}
