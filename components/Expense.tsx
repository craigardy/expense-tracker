

import { TouchableOpacity, Text, View, Image } from 'react-native';
import { images } from '../assets/constants/images';

interface ItemProps {
  category: string;
  date: string;
  amount: string;
  onPress?: () => void;
}

export const Expense = ({ category, date, amount, onPress }: ItemProps) => {
  return (
    <View className="mb-4">
      <TouchableOpacity onPress={onPress} className="flex-row justify-between items-center p-4 bg-dark-100 rounded-lg">
        <View>
          <Text className="text-white text-lg font-semibold">{category}</Text>
          <Text className="text-gray-400">{date}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-white text-lg font-bold">${amount}</Text>
          <Image source={images.chevronRight} className="w-[40px] h-[20px]" resizeMode="contain" />
        </View>
      </TouchableOpacity>
    </View>
  )
}