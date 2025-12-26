import { Redirect, Stack } from "expo-router";
import { View } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useGlobalContext();

  // Show nothing while checking auth
  if (isLoading) {
    return <View />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="expense" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="report" options={{ headerShown: false }} />
    </Stack>
  );
}
