import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

import { useCategories } from '../hooks/useCategories';
import CustomButton from './CustomButton';
import FormField from './FormField';

export type ExpenseFormValues = {
  amount: string;
  category: string;
  date: string;
  notes: string;
};

type Props = {
  title: string;
  initialValues: ExpenseFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
};

const ExpenseForm = ({ title, initialValues, submitLabel, isSubmitting, onSubmit }: Props) => {
  const [form, setForm] = useState<ExpenseFormValues>(initialValues);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { categories, isLoading: isCatLoading, addNewCategory, fetchCategories } = useCategories();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const isBusy = useMemo(() => Boolean(isSubmitting) || isCatLoading, [isSubmitting, isCatLoading]);

  const validate = () => {
    const amountFloat = parseFloat(form.amount);
    if (!form.amount || Number.isNaN(amountFloat) || !form.category || !form.date) {
      if (Platform.OS === 'web') {
        window.alert('Valid amount, category, and date are required');
      } else {
        Alert.alert('Error', 'valid amount, category, and date are required');
      }
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      await onSubmit(form);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error?.message || 'An error occurred'}`);
      } else {
        Alert.alert('Error', error?.message || 'An error occurred');
      }
    }
  };

  const handleSaveCategory = async () => {
    try {
      const newCat = await addNewCategory(newCategoryName);
      setForm((prev) => ({ ...prev, category: newCat.$id }));
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message || 'Failed to add category'}`);
      } else {
        Alert.alert('Error', error.message || 'Failed to add category');
      }
    }
  };

  const handleCancelAddCategory = () => {
    setShowAddCategory(false);
    setNewCategoryName('');
  };

  if (isBusy) {
    return (
      <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50 z-10">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Text className="text-2xl text-white text-semibold mt-2 font-semibold">{title}</Text>

      <FormField
        title="Amount"
        value={form.amount.toString()}
        handleChangeText={(e: string) => setForm((prev) => ({ ...prev, amount: e }))}
        otherStyles="mt-7"
        keyboardType="numeric"
      />

      <View className="mt-2 space-y-2 w-full">
        <Text className="text-base text-gray-100 font-medium">Category</Text>
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-secondary flex-row items-center">
          <Picker
            selectedValue={form.category}
            onValueChange={(itemValue) => {
              setForm((prev) => ({ ...prev, category: itemValue }));
            }}
            style={{ flex: 1, color: '#FFFFFF', backgroundColor: 'transparent' }}
            dropdownIconColor="#FFFFFF"
          >
            <Picker.Item label="Select a category..." value="" />
            {categories.map((category: { $id: string; name: string }) => (
              <Picker.Item key={category.$id} label={category.name} value={category.$id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity onPress={() => setShowAddCategory(true)} disabled={isCatLoading}>
          <Text className="text-blue-400 text-base mt-2 text-center">+ Add New Category</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-2 space-y-2 w-full">
        <Text className="text-base text-gray-100 font-medium">Date</Text>
        {Platform.OS === 'web' ? (
          <View className="border-2 border-black-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-secondary flex-row items-center">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              style={{
                flex: 1,
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 16,
                fontFamily: 'inherit',
              }}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7} className="w-full">
            <View pointerEvents="none">
              <FormField
                title=""
                value={form.date}
                handleChangeText={(e: string) => setForm((prev) => ({ ...prev, date: e }))}
                otherStyles=""
                editable={false}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {Platform.OS !== 'web' && showDatePicker && (
        <DateTimePicker
          value={form.date ? new Date(form.date + 'T00:00:00') : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const day = String(selectedDate.getDate()).padStart(2, '0');
              setForm((prev) => ({ ...prev, date: `${year}-${month}-${day}` }));
            }
          }}
        />
      )}

      <FormField
        title="Notes"
        value={form.notes}
        handleChangeText={(e: string) => setForm((prev) => ({ ...prev, notes: e }))}
        otherStyles="mt-7"
        placeholder="Optional"
      />

      <CustomButton
        title={submitLabel}
        handlePress={submit}
        containerStyles="w-full mt-7"
        isLoading={Boolean(isSubmitting)}
      />

      <Modal
        visible={showAddCategory}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelAddCategory}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={handleCancelAddCategory}
          disabled={isSubmitting || isCatLoading}
        >
          <TouchableOpacity activeOpacity={1} disabled={isSubmitting || isCatLoading}>
            <View className="bg-dark-200 rounded-xl p-6 border-2 border-secondary" style={{ width: 320, maxWidth: '90%' }}>
              <FormField
                title="Category Name"
                value={newCategoryName}
                handleChangeText={(e: string) => {
                  if (e.length <= 20) {
                    setNewCategoryName(e);
                  }
                }}
                otherStyles={''}
                autoFocus={true}
              />
              <View className="flex-row mt-7 gap-2">
                <View className="flex-1">
                  <CustomButton
                    title="Save"
                    handlePress={handleSaveCategory}
                    containerStyles="w-full"
                    isLoading={isSubmitting || isCatLoading}
                  />
                </View>
                <View className="flex-1">
                  <CustomButton
                    title="Cancel"
                    handlePress={handleCancelAddCategory}
                    containerStyles="w-full"
                    isLoading={isSubmitting || isCatLoading}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ExpenseForm;
