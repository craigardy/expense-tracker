/* The main screen users see after logging in. 
It could show a summary of recent expenses, a
chart of spending for the current month */
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { images } from '../../assets/constants/images';

const Home = () => {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={images.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      </ScrollView>
    </View>
  )
}

export default Home