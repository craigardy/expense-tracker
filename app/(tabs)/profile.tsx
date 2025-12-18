/*  A place for users to manage their account details, 
log out, set custom spending categories, 
and configure app settings. */
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile