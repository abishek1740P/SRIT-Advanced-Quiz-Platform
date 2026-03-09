import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityIndicator } from "react-native";

// REPLACE THIS WITH YOUR NEXT.JS URL
const WEB_APP_URL = "https://srit-advanced-quiz-platform.vercel.app";
// For local development, use your computer's IP:
// const WEB_APP_URL = 'http://192.168.1.100:3000';

// Loading component
function LoadingIndicator() {
  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={styles.loadingText}>Loading...</ThemedText>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <WebView
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={LoadingIndicator}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        // Handle errors
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        // Handle messages from your Next.js app
        onMessage={(event) => {
          console.log("Message from web:", event.nativeEvent.data);
        }}
        // Optional: Inject JavaScript when page loads
        injectedJavaScript={`
          // You can inject any JavaScript here
          console.log('WebView loaded');
          true; // required
        `}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
