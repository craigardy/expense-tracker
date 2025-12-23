import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const ReportDetail = () => {
  const { date, type } = useLocalSearchParams();

  const [year, month] =
    type === "year"
      ? [Number(date), undefined]
      : (date as string).split("-").map(Number);
  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <Text className="text-white text-lg">
        Report Detail for {type} {type === "month" && month !== undefined
          ? `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`
          : year}
      </Text>
    </SafeAreaView>
  );

}

export default ReportDetail