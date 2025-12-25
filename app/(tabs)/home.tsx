/* The main screen users see after logging in. 
It could show a summary of recent expenses, a
chart of spending for the current month */
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';
import CategoryBreakdownList from '../../components/CategoryBreakdownList';
import ExpensePieChart from '../../components/ExpensePieChart';
import { useCategories } from '../../hooks/useCategories';
import { useExpenseAnalytics } from '../../hooks/useExpenseAnalytics';
import { useExpenses } from '../../hooks/useExpenses';

const Home = () => {
  const { getUserExpensesByDate: getUserExpensesByMonth, expenses: monthExpenses, isLoading: isMonthExpenseLoading, error: monthExpenseError } = useExpenses();
  const { getUserExpensesByDate: getUserExpensesByYear, expenses: yearExpenses, isLoading: isYearExpenseLoading, error: yearExpenseError } = useExpenses();
  const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategories();

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  React.useEffect(() => {
    getUserExpensesByMonth(year, month);
  }, [getUserExpensesByMonth, year, month]);

  React.useEffect(() => {
    getUserExpensesByYear(year);
  }, [getUserExpensesByYear, year]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Use the expense analytics hook for data processing
  const { totalAmount: monthTotalAmount, categoryData: monthCategoryData, series: monthSeries } = useExpenseAnalytics(monthExpenses, categories);
  const { totalAmount: yearTotalAmount, categoryData: yearCategoryData, series: yearSeries } = useExpenseAnalytics(yearExpenses, categories);

  // Show loading state while fetching or if data hasn't loaded yet
  if (isYearExpenseLoading || isMonthExpenseLoading || isCategoryLoading || !monthExpenses || !yearExpenses || !categories) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (monthExpenseError || yearExpenseError) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">Error: {monthExpenseError || yearExpenseError}</Text>
      </SafeAreaView>
    );
  }

  if (monthExpenses.length === 0 && yearExpenses.length === 0) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">
          No expenses found for this month or year.
        </Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="bg-primary h-full">
          <ScrollView className="w-full flex-1">
            <View className="w-full px-4 items-center pb-24">
              <View className="flex-row items-center w-full relative">
                <Image source={images.appLogo} className="w-[130px] h-[84px]" style={{ width: 130, height: 84 }} resizeMode="contain" />
                <View className="absolute w-full items-center">
                  <Text className="text-white text-2xl font-semibold">Home</Text>
                </View>
              </View>

              <Text className="text-white text-2xl font-semibold mt-4">
                {date.toLocaleString('default', { month: 'long' })} {year} Spending
              </Text>
              <ExpensePieChart series={monthSeries} />
              <Text className="text-white text-xl font-semibold">
                Total: ${monthTotalAmount.toFixed(2)}
              </Text>
              <CategoryBreakdownList categoryData={monthCategoryData} />

              <View className="bg-white w-full h-0.5 mt-4" />

              <Text className="text-white text-2xl font-semibold mt-4">
                {year} Spending
              </Text>
              <ExpensePieChart series={yearSeries} />
              <Text className="text-white text-xl font-semibold mb-4">
                Total: ${yearTotalAmount.toFixed(2)}
              </Text>
              <CategoryBreakdownList categoryData={yearCategoryData} />
            </View>
          </ScrollView>
    </SafeAreaView >
  )
}

export default Home