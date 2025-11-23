import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { icons } from '../../assets/constants/icons';

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View className="flex flex-row flex-1 min-w-[100px] min-h-12 mt-4 mx-4 justify-center items-center rounded-full overflow-hidden bg-[#A8B5DB]">
        <Image 
          source={icon} 
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    )
  }
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  )
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#0f0d23',
          borderRadius: 50,
          marginHorizontal: 1,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0f0d23',
          paddingHorizontal: 16,
        }
      }}
    >
      <Tabs.Screen name="home" options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.home}
            title="Home"
          />
        )
      }} />
      <Tabs.Screen name="expenses" options={{
        title: 'Expenses',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.expenses}
            title="Expenses"
          />
        )
      }} />
      <Tabs.Screen name="add-expense" options={{
        title: 'Add',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.add}
            title="Add"
          />
        )
      }} />
      <Tabs.Screen name="reports" options={{
        title: 'Reports',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.reports}
            title="Report"
          />
        )
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.profile}
            title="Profile"
          />
        )
      }} />

    </Tabs>
  )
}

export default TabsLayout