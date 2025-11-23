import { Text, View } from 'react-native';

interface ItemProps {
  category: string;
  date: string;
  amount: string;
}

export const Item = ({ category, date, amount }: ItemProps) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center p-4 bg-dark-100 rounded-lg">
        <View>
          <Text className="text-white text-lg font-semibold">{category}</Text>
          <Text className="text-gray-400">{date}</Text>
        </View>
        <Text className="text-white text-lg font-bold">${amount}</Text>
      </View>
    </View>
  )
}