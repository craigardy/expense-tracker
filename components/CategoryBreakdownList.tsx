import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { CategoryData } from '../hooks/useExpenseAnalytics';

type CategoryBreakdownListProps = {
  categoryData: CategoryData[];
};

const CategoryBreakdownList: React.FC<CategoryBreakdownListProps> = ({ categoryData }) => {
  const renderItem = useCallback(({ item }: { item: CategoryData }) => (
    <View className="mb-2 p-2 bg-dark-100 rounded-lg">
      <View className="flex-row items-start">
        <View className="w-4 h-4 rounded-full mr-1 mt-1.5" style={{ backgroundColor: item.color }} />
        <Text
          className="text-white text-lg font-semibold flex-1 pr-2"
          numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-white text-lg w-24 text-right">
          ${item.amount.toFixed(2)}
        </Text>
        {/* Separator */}
        <View className="w-px ml-3 bg-white self-stretch" />
        <Text className="text-white text-lg w-16 text-right">
          {item.percentage.toFixed(1)}%
        </Text>
      </View>
    </View>
  ), []);

  return (
    <View className="w-full">
      <View className="bg-dark-200 rounded-xl pl-2 pr-2 pt-2 w-full mt-4 border-2 border-secondary">
        <FlatList
          data={categoryData}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <View className="justify-center items-center">
              <Text className="text-gray-300 text-lg mt-4">No expenses by category.</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default CategoryBreakdownList;
