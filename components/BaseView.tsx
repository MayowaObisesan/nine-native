// File: components/BaseView.tsx
import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '~/components/ui/text';

// Override default Text style to include the Assistant font
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
}
// (Text as any).defaultProps.style = {...(Text as any).defaultProps.style, fontFamily: 'Assistant'};
(Text as any).defaultProps.className = (Text as any).defaultProps.className + ' font-Assistant';


interface BaseViewProps {
  children: ReactNode;
}

export const BaseView: React.FC<BaseViewProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

BaseView.displayName = 'BaseView';
