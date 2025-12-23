/*  A place for users to manage their account details, 
log out, set custom spending categories, 
and configure app settings. */
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';

const data = [
  { label: 'Edit Categories' },
];

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex-1 px-4 items-center">
        <View className="flex-row items-center w-full relative">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <View className="absolute w-full items-center">
            <Text className="text-white text-2xl font-semibold">Profile</Text>
          </View>
        </View>

        <View className="w-full flex-1 pb-20">
          <View className="bg-dark-200 rounded-xl p-6 w-full mt-4 border-2 border-secondary flex-1">
            <FlatList
              data={data}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <View className="mb-4">
                  <TouchableOpacity onPress={() => router.push('/profile/edit-categories')} className="flex-row justify-between items-center p-4 bg-dark-100 rounded-lg">
                    <View>
                      <Text className="text-white text-lg font-semibold">{item.label}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Image source={images.chevronRight} className="w-[40px] h-[20px]" resizeMode="contain" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={() => (
                <View className="justify-center items-center">
                  <Text className="text-gray-300 text-lg mt-4">No profile details available.</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Profile