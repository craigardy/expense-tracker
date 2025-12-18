
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../assets/constants/images'
import ExpenseForm, { type ExpenseFormValues } from '../../components/ExpenseForm'
import { useCategories } from '../../hooks/useCategories'
import { useExpenses } from '../../hooks/useExpenses'



const AddExpense = () => {
  const { addNewExpense, isLoading: isExpenseLoading } = useExpenses();
  const { isLoading: isCatLoading, fetchCategories } = useCategories();

  const [initialValues, setInitialValues] = useState<ExpenseFormValues>({
    amount: '0.00',
    category: '',
    date: new Date().toISOString().split('T')[0],
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
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      Alert.alert('Success', 'Expense added successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during expense addition');
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <ExpenseForm
            title="Add Expense"
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