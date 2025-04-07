import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import {NavHeaderLink} from "~/components/NavHeader";
import * as React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', animation: "default", animationDuration: 200 }} />
      <NavHeaderLink headerTitle={""}/>
      <View>
        <Text>This screen doesn't exist.</Text>

        <Link href='/'>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
