import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBreakdownList from '../../../../components/CategoryBreakdownList';
import ExpensePieChart from '../../../../components/ExpensePieChart';
import { useCategories } from '../../../../hooks/useCategories';
import { useExpenseAnalytics } from '../../../../hooks/useExpenseAnalytics';
import { useExpenses } from '../../../../hooks/useExpenses';


const ReportDetail = () => {
  const { date, type } = useLocalSearchParams();
  const { getUserExpensesByDate, expenses, isLoading: isExpenseLoading, error } = useExpenses();
  const { categories, fetchCategories, isLoading: isCategoryLoading } = useCategories();

  const [year, month] = React.useMemo(() => 
    type === "year"
      ? [Number(date), undefined]
      : (date as string).split("-").map(Number),
    [date, type]
  );

  React.useEffect(() => {
    getUserExpensesByDate(year, month);
  }, [year, month, getUserExpensesByDate]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Memoize the formatted date string
  const dateTitle = React.useMemo(() => {
    return type === "month" && month !== undefined
      ? `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`
      : year.toString();
  }, [type, year, month]);

  // Use the expense analytics hook for data processing
  const { totalAmount, categoryData, series } = useExpenseAnalytics(expenses, categories);

  // Show loading state while fetching or if data hasn't loaded yet
  if (isExpenseLoading || isCategoryLoading || !expenses || !categories) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (expenses.length === 0) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">
          No expenses found for {type} {dateTitle}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
          <View className="w-full flex-1 px-4 items-center pt-4">
            <View className="flex-row items-center w-full relative pb-10">
              <View className="absolute w-full items-center">
                <Text className="text-white text-2xl font-semibold">
                  {dateTitle}
                </Text>
              </View>
            </View>

            <ExpensePieChart series={series} />

            <Text className="text-white text-xl font-semibold mb-4">
              Total: ${totalAmount.toFixed(2)}
            </Text>

            <CategoryBreakdownList categoryData={categoryData} />
          </View>
      </ScrollView>
    </SafeAreaView>
  );

}

export default ReportDetail