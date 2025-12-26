import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#030014' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF' },
        contentStyle: { backgroundColor: '#030014' },
      }}
    >
      <Stack.Screen 
        name="edit-categories" 
        options={{ 
          title: 'Edit Categories',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
