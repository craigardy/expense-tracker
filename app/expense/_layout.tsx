import { Stack } from "expo-router";

export default function ExpenseLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]/index" options={{ 
        title: 'Expense Details',
        headerShown: true,
        headerStyle: { backgroundColor: '#030014' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF' },
      }} />
      <Stack.Screen name="[id]/edit" options={{ 
        title: 'Edit Expense',
        headerShown: true,
        headerStyle: { backgroundColor: '#030014' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF' },
      }} />
    </Stack>
  );
}