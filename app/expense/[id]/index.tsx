import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { images } from '../../../assets/constants/images';
import { useCategories } from '../../../hooks/useCategories';
import { useExpenses } from '../../../hooks/useExpenses';


const ExpenseDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { expense, getUserExpenseById, isLoading, error } = useExpenses();
  const { categories, fetchCategories } = useCategories();

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.$id] = cat.name;
    });
    return map;
  }, [categories]);

  const categoryName = useMemo(() => {
    if (!expense?.category) return 'Unknown';
    return categoryMap[expense.category] || 'Unknown';
  }, [expense?.category, categoryMap]);

  const noteText = useMemo(() => {
    return expense?.notes ?? expense?.note ?? '';
  }, [expense?.notes, expense?.note]);

  const formattedDate = useMemo(() => {
    if (!expense?.date) return 'Invalid date';
    return format(new Date(expense.date), 'yyyy-MM-dd');
  }, [expense?.date]);

  React.useEffect(() => {
    if (id) {
      fetchCategories();
      getUserExpenseById(id as string);
    }
  }, [id, fetchCategories, getUserExpenseById]);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex-1 px-4 items-center justify-center">
          <Text className="text-white text-lg">Loading expense...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex-1 px-4 items-center justify-center">
          <Text className="text-red-400 text-lg">Error: {error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-secondary px-4 py-3 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!expense) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex-1 px-4 items-center justify-center">
          <Text className="text-gray-200 text-lg">No expense found.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-secondary px-4 py-3 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex-1 px-4 items-center">
        {/* <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" /> */}
        {/* <Text className="text-2xl text-white mt-2 font-semibold">Expense Details</Text> */}

        <View className="w-full flex-1 pb-20">
          <View className="bg-dark-200 rounded-xl p-6 w-full mt-4 border-2 border-secondary flex-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300 text-base">Amount</Text>
              <Text className="text-white text-xl font-bold">${expense.amount}</Text>
            </View>

            <View className="h-[1px] bg-dark-100 my-4" />

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300 text-base">Category</Text>
              <Text className="text-white text-base font-semibold">{categoryName}</Text>
            </View>

            <View className="h-[1px] bg-dark-100 my-4" />

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300 text-base">Date</Text>
              <Text className="text-white text-base font-semibold">{formattedDate}</Text>
            </View>

            {noteText ? (
              <>
                <View className="h-[1px] bg-dark-100 my-4" />
                <View>
                  <Text className="text-gray-300 text-base">Notes</Text>
                  <Text className="text-white text-base mt-2">{noteText}</Text>
                </View>
              </>
            ) : null}

            <TouchableOpacity
              onPress={() => router.push(`/expense/${id}/edit`)}
              className="mt-6 bg-secondary px-4 py-3 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Edit Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/expenses')}
              className="mt-4 bg-secondary px-4 py-3 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Back to Expenses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ExpenseDetail