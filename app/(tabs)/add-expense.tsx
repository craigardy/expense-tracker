
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../assets/constants/images'
import CustomButom from '../../components/CustomButton'
import FormField from "../../components/FormField"
import { useCategories } from '../../hooks/useCategories'
import { useExpenses } from '../../hooks/useExpenses'



const AddExpense = () => {
  const [form, setForm] = useState({
    amount: '0.00',
    category: '', // will hold category id
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const { addNewExpense, isLoading: isExpenseLoading } = useExpenses();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { categories, isLoading: isCatLoading, addNewCategory, fetchCategories } = useCategories();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const submit = async () => {
    const amountFloat = parseFloat(form.amount);
    if (!form.amount || isNaN(amountFloat) || !form.category || !form.date) {
      Alert.alert('Error', 'valid amount, category, and date are required');
      return;
    }
    try {
      const res = await addNewExpense(amountFloat, form.category, form.date, form.notes);
      console.log('Expense added successfully:', res);
      setForm({
        amount: '0.00',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      Alert.alert('Success', 'Expense added successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during expense addition');
    }
  };

  const handleSaveCategory = async () => {
    try {
      const newCat = await addNewCategory(newCategoryName);
      setForm({ ...form, category: newCat.$id });
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add category');
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <Text className="text-2xl text-white text-semibold mt-10 font-semibold">Add Expense</Text>
          {/* Amount */}
          <FormField
            title="Amount"
            value={form.amount.toString()}
            handleChangeText={(e: string) => setForm({ ...form, amount: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          {/* Category */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-medium">Category</Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-secondary flex-row items-center">
              <Picker
                selectedValue={form.category}
                onValueChange={(itemValue) => {
                  if (itemValue === 'addNewCat') {
                    setShowAddCategory(true);
                  } else {
                    setForm({ ...form, category: itemValue });
                  }
                }}
                style={{ flex: 1, color: '#FFFFFF' }}
              >
                <Picker.Item label="Select a category..." value="" />
                {categories.map((category: { $id: string; name: string }) => (
                  <Picker.Item key={category.$id} label={category.name} value={category.$id} />
                ))}
                <Picker.Item label="+ Add New Category" value="addNewCat" />
              </Picker>
            </View>
          </View>
          {/* Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <View pointerEvents="none" className="w-full justify-center items-center">
              <FormField
                title="Date"
                value={form.date}
                handleChangeText={(e: string) => setForm({ ...form, date: e })}
                otherStyles="mt-7"
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.date ? new Date(form.date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setForm({ ...form, date: selectedDate.toISOString().split('T')[0] });
                }
              }}
            />
          )}
          {/* Notes */}
          <FormField
            title="Notes"
            value={form.notes}
            handleChangeText={(e: string) => setForm({ ...form, notes: e })}
            otherStyles="mt-7"
            placeholder="Optional"
          />
          {/* submit */}
          <CustomButom
            title="Add"
            handlePress={submit}
            containerStyles="w-full mt-7"
            isLoading={isExpenseLoading}
          />
        </View>
      </ScrollView>

      {/* Add Category Modal (inline) */}
      <Modal
        visible={showAddCategory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddCategory(false);
          setNewCategoryName('');
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={() => {
            setShowAddCategory(false);
            setNewCategoryName('');
          }}
          disabled={isExpenseLoading || isCatLoading}
        >
          <TouchableOpacity activeOpacity={1} disabled={isExpenseLoading || isCatLoading}>
            <View className="bg-dark-200 rounded-xl p-6 w-4/5 border-2 border-secondary">
              <FormField
                title="Category Name"
                value={newCategoryName}
                handleChangeText={setNewCategoryName}
                otherStyles=""
              />
              <View className="flex-row mt-7">
                <CustomButom
                  title="Save"
                  handlePress={handleSaveCategory}
                  containerStyles="w-1/2 m-1"
                  isLoading={isExpenseLoading || isCatLoading}
                />
                <CustomButom
                  title="Cancel"
                  handlePress={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  containerStyles="w-1/2 m-1"
                  isLoading={isExpenseLoading || isCatLoading}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default AddExpense