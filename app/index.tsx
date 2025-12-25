
import { Redirect, router, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../assets/constants/images';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

const Index = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex-1 justify-center items-center">
        </View>
      </SafeAreaView>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full flex-1 px-4 items-center">
          <View className="items-center w-full">
            <Image
              source={images.appLogo}
              className="w-[130px] h-[84px]"
              style={{ width: 130, height: 84 }}
              resizeMode="contain"
            />
            <Text className="text-white text-xl font-semibold mt-2">Expense Tracker</Text>
          </View>

          <View className="w-full flex-1 justify-center pb-20">
            <View className="relative">
              <Text className="text-5xl text-white font-bold text-center">
                Simple tracking. Smarter decisions.
              </Text>
            </View>
            <Text className="text-sm text-gray-100 mt-7 text-center">
              Designed for better financial habits.
            </Text>
            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push('/sign-in')}
              containerStyles="w-full mt-7" />
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style='light' />
    </SafeAreaView>
  )
}

export default Index