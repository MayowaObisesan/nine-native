import {View} from 'react-native';
import {Text} from '~/components/ui/text';
import React from "react";

type LabelFieldProps = {
  text: string;
  style?: object;
  children?: React.ReactNode;
};

export const LabelField = ({text, style, children}: LabelFieldProps) => {
  return (
    <View style={style}>
      <Text style={{height: 40, lineHeight: 40}}>{text}</Text>
      {children}
    </View>
  );
};

type FormFieldProps = {
  style?: object;
  children?: React.ReactNode;
};

export const FormField = ({style, children}: FormFieldProps) => {
  return (
    <View style={[{marginVertical: 16}, style]}>
      {children}
    </View>
  );
};
