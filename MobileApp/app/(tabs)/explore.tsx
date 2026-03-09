import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ExploreScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconSymbol size={60} name="info.circle.fill" color="#007AFF" />
        <ThemedText type="title" style={styles.title}>
          App Info
        </ThemedText>
        <ThemedText style={styles.version}>
          Version 1.0.0{" "}
          {/* Hardcoded version instead of using expo-application */}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => openLink("https://your-nextjs-app.com")}
        >
          <IconSymbol size={24} name="globe" color="#007AFF" />
          <ThemedText style={styles.menuText}>Open in Browser</ThemedText>
          <IconSymbol size={20} name="chevron.right" color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => openLink("https://your-website.com/privacy")}
        >
          <IconSymbol size={24} name="lock.shield" color="#007AFF" />
          <ThemedText style={styles.menuText}>Privacy Policy</ThemedText>
          <IconSymbol size={20} name="chevron.right" color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => openLink("https://your-website.com/terms")}
        >
          <IconSymbol size={24} name="doc.text" color="#007AFF" />
          <ThemedText style={styles.menuText}>Terms of Service</ThemedText>
          <IconSymbol size={20} name="chevron.right" color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => openLink("mailto:support@your-app.com")}
        >
          <IconSymbol size={24} name="envelope" color="#007AFF" />
          <ThemedText style={styles.menuText}>Contact Support</ThemedText>
          <IconSymbol size={20} name="chevron.right" color="#999" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          © 2024 Your Company Name. All rights reserved.
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  version: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
