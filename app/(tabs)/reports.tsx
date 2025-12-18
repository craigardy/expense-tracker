/*  This tab would house the breakdown and trends features. 
Could have different charts and graphs to visualize spending by category, 
see spending trends over time (e.g., month-over-month), 
and get insights into their financial habits. */
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';

const Reports = () => {
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

export default Reports