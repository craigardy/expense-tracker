/*  A detailed list of all transactions. 
Here, users could scroll through their expense history, 
filter by category or date, 
and tap on an expense to see more details or edit it. */
/* Add a search bar, use a state variable 
(ex: searchQuery) to hold the text from the search bar.
 as the user types, you filter the list of expenses that 
 is displayed on that very same screen. */
// import { format } from 'date-fns';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';
import { Item } from '../../components/Expense';
import { useCategories } from '../../hooks/useCategories';
import { useExpenses } from '../../hooks/useExpenses';

const Expenses = () => {
  const { expenses, getUserExpenses, isLoading: isExpenseLoading } = useExpenses();
  const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategories();

  useEffect(() => {
    fetchCategories();
    getUserExpenses();
  }, []);

  if (isExpenseLoading || isCategoryLoading) {
    return (
      <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50 z-10">
        <Text className="text-white text-lg">Loading expenses...</Text>
      </View>
    );
  }

  // Category ID to Name mapping
  interface Category {
    $id: string;
    name: string;
  }
  const categoryMap: { [key: string]: string } = {};
  categories.forEach((cat: Category) => {
    categoryMap[cat.$id] = cat.name;
  });

  // Format expenses with category names and formatted dates
  const formattedExpenses = expenses.map(exp => ({
    ...exp,
    date: exp.date ? format(new Date(exp.date), 'yyyy-MM-dd') : 'Invalid date',
    categoryName: categoryMap[exp.category] || 'Unknown',
  }));

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center items-center min-h-[85vh] px-4">
        <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
        <Text className="text-2xl text-white text-semibold mt-10 font-semibold">Expenses</Text>
        <View className="w-full flex-1 justify-center pb-20">
          <View className="bg-dark-200 rounded-xl p-6 w-full mt-10 border-2 border-secondary">
            <FlatList
              data={formattedExpenses}
              renderItem={({ item }) => (
                <Item
                  category={item.categoryName}
                  date={item.date}
                  amount={item.amount}
                />
              )}
              keyExtractor={(item) => item.$id}
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