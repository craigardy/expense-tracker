import { Stack } from "expo-router";

export default function ExpenseLayout() {
  return (
    <Stack>
      <Stack.Screen name="[date]/index" options={{ 
        title: 'Report Details',
        headerShown: true,
        headerStyle: { backgroundColor: '#030014' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF' },
      }} />
    </Stack>
  );
}