import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
}

const FormField = ({ title, value, handleChangeText, otherStyles, keyboardType, placeholder, editable, autoFocus }: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 w-full ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-secondary flex-row items-center">
        <TextInput className="flex-1 text-white font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          editable={editable !== false}
          keyboardType={keyboardType || 'default'}
          autoFocus={autoFocus}
        />
        {title === 'Password' && (
          <TouchableOpacity
            className="ml-2"
            onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-sm text-secondary font-medium">{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField