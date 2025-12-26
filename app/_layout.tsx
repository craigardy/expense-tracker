import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalProvider } from "../context/GlobalProvider";
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") {
      // Set theme-color meta tag for Safari
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#000000");
      } else {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = "#000000";
        document.head.appendChild(meta);
      }

      // Set apple-mobile-web-app-status-bar-style
      const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (metaAppleStatusBar) {
        metaAppleStatusBar.setAttribute("content", "black-translucent");
      } else {
        const meta = document.createElement("meta");
        meta.name = "apple-mobile-web-app-status-bar-style";
        meta.content = "black-translucent";
        document.head.appendChild(meta);
      }

      // Add apple-touch-icon
      const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!existingAppleIcon) {
        const link = document.createElement("link");
        link.rel = "apple-touch-icon";
        link.href = "/icon-192.png";
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <GlobalProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GlobalProvider>
  );
}
