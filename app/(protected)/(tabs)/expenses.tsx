/*  A detailed list of all transactions. 
Here, users could scroll through their expense history, 
filter by category or date, 
and tap on an expense to see more details or edit it. */
/* Add a search bar, use a state variable 
(ex: searchQuery) to hold the text from the search bar.
 as the user types, you filter the list of expenses that 
 is displayed on that very same screen. */
// import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../../assets/constants/images';
import { Expense } from '../../../components/Expense';
import FormField from '../../../components/FormField';
import { useCategories } from '../../../hooks/useCategories';
import { useExpenses } from '../../../hooks/useExpenses';


const Expenses = () => {
  const router = useRouter();
  const { expenses, getUserExpenses, isLoading: isExpenseLoading } = useExpenses();
  const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
      getUserExpenses();
    }, [fetchCategories, getUserExpenses])
  );

  // Category ID to Name mapping
  const categoryMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    categories.forEach((cat) => {
      map[cat.$id] = cat.name;
    });
    return map;
  }, [categories]);

  // Format expenses with category names and formatted dates
  const formattedExpenses = useMemo(() => {
    return expenses.map(exp => ({
      ...exp,
      date: exp.date ? format(new Date(exp.date), 'yyyy-MM-dd') : 'Invalid date',
      categoryName: categoryMap[exp.category] || 'Unknown',
    }));
  }, [expenses, categoryMap]);

  // filtering logic
  const filteredExpenses = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return formattedExpenses.filter(expense =>
      expense.categoryName.toLowerCase().includes(searchLower) ||
      expense.date.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchLower) ||
      (expense.note ? expense.note.toLowerCase().includes(searchLower) : false)
    );
  }, [formattedExpenses, searchQuery]);

  if (isExpenseLoading || isCategoryLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50 z-10">
          <Text className="text-white text-lg">Loading expenses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex-1 px-4 items-center">
        <View className="flex-row items-center w-full relative">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" style={{ width: 130, height: 84 }} resizeMode="contain" />
          <View className="absolute w-full items-center">
            <Text className="text-2xl text-white text-semibold font-semibold">Expenses</Text>
          </View>
        </View>
        {/* Search */}
        <View className="rounded-xl pt-1 w-full mt-2 border-2">
          <FormField
            title="Search Expenses"
            placeholder="Search by category, date, amount, or note"
            value={searchQuery}
            handleChangeText={(e: string) => setSearchQuery(e)}
            otherStyles="mb-4"
          />
        </View>
        {/* Expenses */}
        <View className="w-full flex-1 pb-20">
          <View className="bg-dark-200 rounded-xl p-6 w-full mt-4 border-2 border-secondary flex-1">
            <FlatList
              data={filteredExpenses}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <Expense
                  category={item.categoryName}
                  date={item.date}
                  amount={item.amount}
                  onPress={() => router.push(`/expense/${item.$id}`)}
                />
              )}
              ListEmptyComponent={() => (
                <View className="justify-center items-center">
                  <Text className="text-gray-300 text-lg mt-4">No expenses recorded yet.</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Expenses