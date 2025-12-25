
import React, { useEffect, useState } from 'react'
import { Alert, Image, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../assets/constants/images'
import ExpenseForm, { type ExpenseFormValues } from '../../components/ExpenseForm'
import { useCategories } from '../../hooks/useCategories'
import { useExpenses } from '../../hooks/useExpenses'



const AddExpense = () => {
  const { addNewExpense, isLoading: isExpenseLoading } = useExpenses();
  const { isLoading: isCatLoading, fetchCategories } = useCategories();

  const getLocalDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [initialValues, setInitialValues] = useState<ExpenseFormValues>({
    amount: '0.00',
    category: '',
    date: getLocalDateString(),
    notes: '',
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const submit = async (values: ExpenseFormValues) => {
    const amountFloat = parseFloat(values.amount);
    try {
      await addNewExpense(amountFloat, values.category, values.date, values.notes);
      setInitialValues({
        amount: '0.00',
        category: '',
        date: getLocalDateString(),
        notes: '',
      });
      if (Platform.OS === 'web') {
        window.alert('Expense added successfully');
      } else {
        Alert.alert('Success', 'Expense added successfully');
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message || 'An error occurred during expense addition'}`);
      } else {
        Alert.alert('Error', error.message || 'An error occurred during expense addition');
      }
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
          <ScrollView>
            <View className="w-full justify-center items-center min-h-[85vh] px-4">
              
              <View className="flex-row items-center w-full relative">
                <Image source={images.appLogo} className="w-[130px] h-[84px]" style={{ width: 130, height: 84 }} resizeMode="contain" />
                <View className="absolute w-full items-center">
                  <Text className="text-white text-2xl font-semibold">Add Expense</Text>
                </View>
              </View>

              <ExpenseForm
                title=""
                initialValues={initialValues}
                submitLabel="Add"
                isSubmitting={isExpenseLoading || isCatLoading}
                onSubmit={submit}
              />
            </View>
          </ScrollView>
    </SafeAreaView>
  )
}

export default AddExpense