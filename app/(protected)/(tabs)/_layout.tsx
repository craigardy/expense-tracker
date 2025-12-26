import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image } from 'react-native';
import { icons } from '../../../assets/constants/icons';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#A8B5DB',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: '#0f0d23',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 80,
            paddingBottom: 15,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen 
          name="home" 
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image 
                source={icons.home} 
                style={{ width: 24, height: 24, tintColor: color }}
                resizeMode="contain"
              />
            )
          }} 
        />
        <Tabs.Screen 
          name="expenses" 
          options={{
            title: 'Expenses',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image 
                source={icons.expenses} 
                style={{ width: 24, height: 24, tintColor: color }}
                resizeMode="contain"
              />
            )
          }} 
        />
        <Tabs.Screen 
          name="add-expense" 
          options={{
            title: 'Add',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image 
                source={icons.add} 
                style={{ width: 24, height: 24, tintColor: color }}
                resizeMode="contain"
              />
            )
          }} 
        />
        <Tabs.Screen 
          name="reports" 
          options={{
            title: 'Reports',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image 
                source={icons.reports} 
                style={{ width: 24, height: 24, tintColor: color }}
                resizeMode="contain"
              />
            )
          }} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image 
                source={icons.profile} 
                style={{ width: 24, height: 24, tintColor: color }}
                resizeMode="contain"
              />
            )
          }} 
        />
      </Tabs>
      <StatusBar backgroundColor="#030014" style='light'/>
    </>
  )
}

export default TabsLayout