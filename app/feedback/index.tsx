import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import { NavHeaderLink } from "~/components/NavHeader";

export default function FeedbackPage() {
  // Replace 192.168.1.X with your actual local IP address
  // const devServerUrl = 'http://192.168.1.191:3000/embed?fdb=3ZHAh1tcBvYcu3hTPz2z6kuJ';
  const stagingServerUrl = 'https://feedbacks-ten.vercel.app/embed?fdb=3ZmKECAYFD8AoWBo2byhEr6Q';

  return (
    <View style={{ flex: 1 }}>
      <NavHeaderLink headerTitle={"Send Feedback"}/>
      <WebView
        source={{ uri: stagingServerUrl }}
        style={{ flex: 1 }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
}
