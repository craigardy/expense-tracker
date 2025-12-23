/*  This tab would house the breakdown and trends features. 
Could have different charts and graphs to visualize spending by category, 
see spending trends over time (e.g., month-over-month), 
and get insights into their financial habits. */
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../assets/constants/images';
import { useExpenses } from '../../hooks/useExpenses';


type ListItem =
  | { type: 'year'; year: number }
  | { type: 'month'; year: number; month: number };

const Reports = () => {
  const { getUniqueUserExpenseDates, isLoading: isExpenseLoading, dates } = useExpenses();
  useEffect(() => {
    getUniqueUserExpenseDates();
  }, [getUniqueUserExpenseDates]);

  // Merge years and months into a single sorted list
  const mergedData: ListItem[] = React.useMemo(() => {
    if (!dates) return [];

    const items: ListItem[] = [
      ...dates.years.map(y => ({ type: 'year' as const, year: y.year })),
      ...dates.months.map(m => ({ type: 'month' as const, year: m.year, month: m.month }))
    ];

    // Sort by year (desc), then by type (years before months), then by month (desc)
    return items.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (a.type !== b.type) return a.type === 'year' ? -1 : 1;
      if (a.type === 'month' && b.type === 'month') {
        return b.month - a.month;
      }
      return 0;
    });
  }, [dates]);

  if (isExpenseLoading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex-1 px-4 items-center">
        <View className="flex-row items-center w-full relative">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <View className="absolute w-full items-center">
            <Text className="text-white text-2xl font-semibold">Reports</Text>
          </View>
        </View>

        <View className="w-full flex-1 pb-20">
          <View className="bg-dark-200 rounded-xl p-6 w-full mt-4 border-2 border-secondary flex-1">

            <FlatList
              data={mergedData}
              keyExtractor={(item) =>
                item.type === 'year'
                  ? `year-${item.year}`
                  : `month-${item.year}-${item.month}`
              }
              renderItem={({ item }) => (
                <View className="mb-3">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/report/[date]",
                        params: {
                          date: item.type === "year" ? String(item.year) : `${item.year}-${item.month}`,
                          type: item.type
                        },
                      })
                    }
                    className="flex-row justify-between items-center p-4 bg-dark-100 rounded-lg">
                    <View>
                      <Text className="text-white text-lg font-semibold">
                        {item.type === 'year'
                          ? item.year
                          : `${new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' })} ${item.year}`
                        }
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Image source={images.chevronRight} className="w-[40px] h-[20px]" resizeMode="contain" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={() => (
                <View className="justify-center items-center">
                  <Text className="text-gray-300 text-lg mt-4">No expense dates available.</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Reports