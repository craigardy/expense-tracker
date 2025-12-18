/* The main screen users see after logging in. 
It could show a summary of recent expenses, a
chart of spending for the current month */
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';

const Home = () => {
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

export default Home