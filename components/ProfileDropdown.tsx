import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {Text} from '~/components/ui/text';
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {SignedIn, SignedOut, useUser} from '@clerk/clerk-expo';
import {Muted} from "~/components/ui/typography";
import {SignOutButton} from "~/components/SignOut";
import {Button} from "~/components/ui/button";
import {cn} from "~/lib/utils";
import {Link, router} from "expo-router";
import {StyleSheet} from "react-native";

export default function ProfileDropDown() {
  const {user, isSignedIn} = useUser();

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar alt={user?.firstName?.toString()!}>
              <AvatarImage source={{uri: user?.imageUrl}}/>
              <AvatarFallback>
                <Text>{user ? user.firstName![0] : undefined}</Text>
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            // insets={contentInsets}
            className='w-64 native:w-56 rounded-2xl border-0 -ml-1 my-4'
            align={"center"}
          >
            <DropdownMenuItem
              onPress={() => {
                router.push("/profile")
              }}
              className={"flex-col items-stretch gap-y-0 p-0"}
            >
              <DropdownMenuLabel>
                <Muted>My Account</Muted>
              </DropdownMenuLabel>
              <DropdownMenuLabel className={"b-purple-400"}>
                <Text className={"b-orange-400 w-full"}>{user?.fullName}</Text>
              </DropdownMenuLabel>
            </DropdownMenuItem>
            {/*<DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem textValue={"Team"}>
                <Text className={"text-xs"}>Team</Text>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Text className={"text-xs"}>Invite users</Text>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <Animated.View entering={FadeIn.duration(200)}>
                    <DropdownMenuItem>
                      <Text className={"text-xs"}>Email</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Text>Message</Text>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                      <Text>More...</Text>
                    </DropdownMenuItem>
                  </Animated.View>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <Text>New Team</Text>
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>*/}
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <Text style={styles.item} className={""}>GitHub</Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => router.push("/feedback")} closeOnPress={true}>
              <Text style={styles.item}>Send Feedback</Text>
            </DropdownMenuItem>
            {/*<DropdownMenuItem disabled>
              <Text>API</Text>
            </DropdownMenuItem>*/}
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <SignOutButton/>
              {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      <SignedOut>
        <Link asChild href={"/(auth)/sign-in"}>
          <Button className={cn("bg-nine rounded-2xl")}>
            <Text className={"font-Assistant font-bold text-2xl text-nine-foreground"}>Sign in</Text>
          </Button>
        </Link>
      </SignedOut>
    </>
  )
    ;
}

const styles = StyleSheet.create({
  item: {fontSize: 14}
})
