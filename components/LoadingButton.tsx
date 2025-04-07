import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Text} from '~/components/ui/text';

interface LoadingButtonProps {
  color?: string;
  size?: number | 'small' | 'large';
  text?: string;
}

export function LoadingButton(
  {
    color = '#ffffff',
    size = 'small',
    text = 'Loading...'
  }: LoadingButtonProps) {
  return (
    <View className="flex-row items-center justify-center gap-x-2">
      <ActivityIndicator color={color} size={size}/>
      {text !== "" && <Text className="text-white">{text}</Text>}
    </View>
  );
}
