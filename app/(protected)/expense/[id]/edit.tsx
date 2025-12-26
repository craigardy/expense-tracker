import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpenseForm, { type ExpenseFormValues } from '../../../../components/ExpenseForm';
import { useExpenses } from '../../../../hooks/useExpenses';

const EditExpense = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { expense, getUserExpenseById, updateUserExpenseById, isLoading, error } = useExpenses();

  React.useEffect(() => {
    if (id) {
      getUserExpenseById(id as string);
    }
  }, [id, getUserExpenseById]);

  const initialValues = useMemo<ExpenseFormValues>(() => {
    const dateValue = expense?.date 
      ? new Date(expense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    return {
      amount: expense?.amount != null ? String(expense.amount) : '0.00',
      category: expense?.category ?? '',
      date: dateValue,
      notes: (expense?.notes ?? expense?.note ?? '') as string,
    };
  }, [expense?.amount, expense?.category, expense?.date, expense?.notes, expense?.note]);

  const onSubmit = async (values: ExpenseFormValues) => {
    if (!id) {
      if (Platform.OS === 'web') {
        window.alert('Error: Missing expense id');
      } else {
        Alert.alert('Error', 'Missing expense id');
      }
      return;
    }
    const amountFloat = parseFloat(values.amount);
    await updateUserExpenseById(id as string, {
      amount: amountFloat,
      category: values.category,
      date: values.date,
      notes: values.notes,
    });

    if (Platform.OS === 'web') {
      window.alert('Expense updated');
    } else {
      Alert.alert('Success', 'Expense updated');
    }
    router.replace(`/expense/${id}`);
  };

  if (isLoading && !expense) {
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
            onPress={() => router.replace(`/expenses`)}
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
      <ScrollView>
        <View className="w-full flex-1 px-4 items-center justify-center">
          {/* <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" /> */}
          <ExpenseForm
            title=""
            initialValues={initialValues}
            submitLabel="Save"
            isSubmitting={isLoading}
            onSubmit={onSubmit}
          />
          <TouchableOpacity
            onPress={() => router.push(`/expense/${id}`)}
            className="mt-4 bg-secondary rounded-xl min-h-[62px] w-full justify-center items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditExpense;
