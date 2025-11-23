import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../assets/constants/images'
import CustomButom from '../../components/CustomButton'
import FormField from "../../components/FormField"

import { useUser } from '../../hooks/useUser'


const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const { registerUser, isLoading } = useUser();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Email and password are required');
      console.error('Email and password are required');
      return;
    }
    try {
      await registerUser(form.email, form.password);
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during sign up');
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <Text className="text-2xl text-white text-semibold mt-10 font-semibold">Sign up</Text>
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isLoading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              {"Already have an account?"}
            </Text>
            <Link href="/sign-in" className="text-lg text-secondary font-semibold">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp