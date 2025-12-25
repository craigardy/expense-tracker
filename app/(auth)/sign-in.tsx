import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Platform, ScrollView, Text, View, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../assets/constants/images'
import CustomButom from '../../components/CustomButton'
import FormField from "../../components/FormField"
import { useUser } from '../../hooks/useUser'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const { signInUser, isLoading } = useUser();

  const submit = async () => {
    if (!form.email || !form.password) {
      if (Platform.OS === 'web') {
        window.alert('Email and password are required');
      } else {
        Alert.alert('Error', 'Email and password are required');
      }
      console.error('Email and password are required');
      return;
    }
    try {
      await signInUser(form.email, form.password);
      router.replace('/home');
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message || 'An error occurred during sign in'}`);
      } else {
        Alert.alert('Error', error.message || 'An error occurred during sign in');
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
          <ScrollView>
            <View className="w-full justify-center items-center min-h-[85vh] px-4">
              <View className="flex-row items-center w-full relative">
                <Image
                  source={images.appLogo}
                  className="w-[130px] h-[84px]"
                  style={{ width: 130, height: 84 }}
                  resizeMode="contain"
                />
                <View className="absolute w-full items-center">
                  <Text className="text-white text-2xl font-semibold">Log in</Text>
                </View>
              </View>
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e: string) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address"
              />
              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e: string) => setForm({ ...form, password: e })}
                otherStyles="mt-7"
              />
              <CustomButom
                title="Sign In"
                handlePress={submit}
                containerStyles="w-full mt-7"
                isLoading={isLoading}
              />
              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-gray-100 font-regular">
                  {"Don't have an account?"}
                </Text>
                <Link href="/sign-up" className="text-lg text-secondary font-semibold">Sign Up</Link>
              </View>
            </View>
          </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn