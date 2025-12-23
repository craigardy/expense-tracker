import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalProvider } from "../context/GlobalProvider";
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GlobalProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="expense" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="report" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GlobalProvider>
  );
}
