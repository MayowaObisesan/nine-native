import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";

import {SignedIn, SignedOut, useUser} from '@clerk/clerk-expo'
import {Link, router} from 'expo-router'
import RepoSelectionScreen from "~/components/RepoSelectionScreen";
import {Text} from "~/components/ui/text";
import {NavHeaderLink} from "~/components/NavHeader";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {LucideX} from "lucide-react-native";
import {useColorScheme} from "~/lib/useColorScheme";
import {Separator} from "~/components/ui/separator";
import {Button} from "~/components/ui/button";
import {useNineContext} from "~/contexts";
import {E_DBTables} from "~/types/enums";
import {getRepoLanguages, getRepoReadme} from "~/api/github";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import {Info} from "~/lib/icons/Info";
import {toast} from "sonner-native";
import {useCreateApp} from "~/hook/useApps";
import {LoadingButton} from "~/components/LoadingButton";

// const REDIRECT_URI = AuthSession.makeRedirectUri();

const AuthScreen = ({onAuthSuccess}: { onAuthSuccess: (token: string) => void }) => {
  const {supabaseClient} = useNineContext();
  const {isDarkColorScheme} = useColorScheme();
  const {isLoaded, isSignedIn, user} = useUser()
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [userDb, setUserDb] = useState([]);
  const [appsDb, setAppsDb] = useState([]);
  const [appSubmitLoading, setAppSubmitLoading] = useState<boolean>(false);
  const createApp = useCreateApp();

  // const {signInWithGitHub} = useGitHubAuth();
  // const [error, setError] = useState<string | null>(null);
  //
  // async function signInWithGitHubExpo() {
  //   const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read:user`;
  //
  //   const result = await AuthSession.startAsync({authUrl});
  //
  //   if (result.type === "success") {
  //     await SecureStore.setItemAsync("githubToken", result.params.code);
  //     console.log("GitHub token stored!");
  //   }
  // }
  //
  // const handleLogin = async () => {
  //   try {
  //     const authResult = await authorize(githubAuthConfig);
  //     onAuthSuccess(authResult.accessToken);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Authentication failed. Please try again.");
  //   }
  // };

  useEffect(() => {
    async function fetchUserFromDB() {
      if (isSignedIn) {
        const {data, error} = await supabaseClient
          .from(E_DBTables.User)
          .select("*")
          .eq("email", user?.primaryEmailAddress?.emailAddress);

        if (error) {
          console.error("Error fetching user", error);
        }

        if (data && data.length > 0) {
          setUserDb(data);
          const {count: appsCount, data: appsData, error: appsError} = await supabaseClient
            .from(E_DBTables.Apps)
            .select("*", {count: "exact"})
            .eq("owner", user?.emailAddresses[0].emailAddress);

          if (appsError) {
            console.error("Error fetching apps", appsError);
          }

          if (appsCount > 0) {
            setAppsDb(appsData);
          }
        }
      }
    }

    if (isLoaded) {
      fetchUserFromDB();
    }
  }, []);

  const handleRepoSelect = (repo: any) => {
    console.log("Selected repo", repo.name);
  }

  const fetchRepoLanguages = async (url: string) => {
    return await getRepoLanguages(url);
  }

  const fetchRepoReadme = async (owner_name: string, repo_name: string) => {
    const readme = await getRepoReadme(owner_name, repo_name);
    return readme.decodedContent;
  }

  async function handleCreateAppFromRepos() {
    setAppSubmitLoading(true);
    try {
      const appsToCreate = [];
      const processRepos = await Promise.all(
        selectedList.map(async (eachSelected) => {
          try {
            const stack = await fetchRepoLanguages(eachSelected.languages_url);
            const readme = await fetchRepoReadme(eachSelected.owner.login, eachSelected.name);

            return {
              name: eachSelected.name,
              name_id: eachSelected.name,
              description: eachSelected.description,
              long_description: readme || "",
              owner: user?.emailAddresses[0].emailAddress,
              website: eachSelected.homepage || eachSelected.html_url,
              stack: stack,
              external_link: eachSelected.html_url,
              github_repo: eachSelected.html_url,
            };
          } catch (error) {
            console.error(`Error processing repo ${eachSelected.name}:`, error);
            toast.error(`Error processing repo ${eachSelected.name}`);
            return null;
          }
        })
      );

      // Filter out any null values from failed repo processing
      const validAppsToCreate = processRepos.filter(app => app !== null);
      appsToCreate.push(...validAppsToCreate);

      // const {data, error} = await supabaseClient.from(E_DBTables.Apps).insert(appsToCreate).select();
      // if (error) {
      //   throw new Error(`Error creating apps: ${error.message}`);
      // }

      // if (data && data.length > 0) {
      //   toast.success("Apps created successfully");
      //
      //   // Next,
      //   // 1. Redirect to the home page.
      //   // 2. Show an alert at the home page to update the apps you created
      // }

      await createApp.mutateAsync(appsToCreate);
      toast.success("Apps created successfully");

      // Next,
      // 1. Redirect to the home page.
      // 2. Show an alert at the home page to update the apps you created
      router.push("/");
    } catch (error) {
      console.error("Error in handleCreateAppFromRepos:", error);
      toast.error("Error creating apps. Try again soon.");
    } finally {
      setAppSubmitLoading(false);
    }
  }

  return (
    <View className={"h-full flex-1"}>
      <NavHeaderLink headerTitle={"Select from your repository"}/>
      {/*<Button title="Sign in with GitHub" onPress={signInWithGitHub}/>*/}
      {/*<Alert icon={AlertTriangle} variant='destructive' className='max-w-xl'>
        <AlertTitle>Danger!</AlertTitle>
        <AlertDescription>
          High voltage. Do not touch. Risk of electric shock. Keep away from children.
        </AlertDescription>
      </Alert>*/}
      {/*<Button title="Sign in with GitHub - Expo session" onPress={signInWithGitHubExpo}/>*/}
      {/*{error && <Text style={{color: "red"}}>{error}</Text>}*/}

      <View className={"flex-1"}>
        <SignedOut>
          <Link href="/(auth)/sign-in" className={"my-40"}>
            <Text className={"text-xl text-center"}>You need to Sign in first</Text>
          </Link>
          {/*<Link href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>*/}
        </SignedOut>
        <SignedIn>
          <View className={"flex-1 py-2"}>
            <View className={"px-4"}>
              {
                selectedList.length === 0
                && userDb.length > 0
                && appsDb.length === 0
                && <Alert icon={Info} className='max-w-xl bg-amber-400 border-0 rounded-xl'>
                      <AlertTitle className={"font-bold"}>Heads up!</AlertTitle>
                      <AlertDescription>
                          You need to select at least one repository to create an app.
                      </AlertDescription>
                  </Alert>
              }
            </View>
            {/*<Text className={"text-xl px-2 pb-4"}>Hey <Text className={"font-bold text-xl"}>{user?.emailAddresses[0].emailAddress}</Text></Text>*/}
            <RepoSelectionScreen
              onRepoSelect={handleRepoSelect}
              selectedList={selectedList}
              onSelectedList={setSelectedList}
            />

            <View className={"px-8"}>
              <Button disabled={appSubmitLoading} size={"lg"} className={"bg-nine rounded-2xl"}
                      onPress={handleCreateAppFromRepos}>
                {
                  appSubmitLoading
                    ? <View className={"flex flex-row items-center gap-x-2"}>
                      <LoadingButton text={""} size={"large"} />
                      <Text>
                      Adding projects...</Text>
                    </View>
                    : <Text className={"font-bold text-nine-foreground"}>Proceed</Text>
                }
              </Button>
            </View>
            <View className={""}>
              {
                selectedList.length > 0 &&
                  <View className={"gap-3 px-4 py-2 rounded-full"}>
                      <Separator className={"my-1 w-full"}/>
                      <View className={"flex-row justify-between items-center px-4"}>
                          <Text className={"font-bold text-lg"}>Selected Repos</Text>
                          <Text
                              className={"font-black text-center bg-black text-white w-10 h-10 leading-10 rounded-xl"}>{selectedList.length}</Text>
                      </View>
                      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} className={""}>
                          <View className={"flex flex-row gap-2"}>
                            {
                              selectedList.map((item, index) => {
                                return (
                                  <View key={index}
                                        className={"flex flex-row items-center gap-2 w-auto pl-3 pr-1 py-1 bg-muted-foreground/20 border border-muted-foreground/20 rounded-full"}>
                                    <Text>{item.name}</Text>
                                    <Button size={"icon"} variant={"ghost"} className={"w-8 h-8"} onPress={() => {
                                      setSelectedList(selectedList.filter((i) => i.name !== item.name))
                                    }}>
                                      <Text className={"bg-primary p-1 rounded-full"}>
                                        <LucideX
                                          color={!isDarkColorScheme ? DarkTheme.colors.text : DefaultTheme.colors.text}
                                          size={16}
                                          strokeWidth={4}
                                        />
                                      </Text>
                                    </Button>
                                  </View>
                                )
                              })
                            }
                          </View>
                      </ScrollView>
                  </View>
              }
            </View>
          </View>
        </SignedIn>
      </View>
    </View>
  );
};

export default AuthScreen;
