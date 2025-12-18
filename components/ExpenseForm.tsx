import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';

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
      Alert.alert('Error', 'valid amount, category, and date are required');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      await onSubmit(form);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred');
    }
  };

  const handleSaveCategory = async () => {
    try {
      const newCat = await addNewCategory(newCategoryName);
      setForm((prev) => ({ ...prev, category: newCat.$id }));
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add category');
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
      <Text className="text-2xl text-white text-semibold mt-10 font-semibold">{title}</Text>

      <FormField
        title="Amount"
        value={form.amount.toString()}
        handleChangeText={(e: string) => setForm((prev) => ({ ...prev, amount: e }))}
        otherStyles="mt-7"
        keyboardType="numeric"
      />

      <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-medium">Category</Text>
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-secondary flex-row items-center">
          <Picker
            selectedValue={form.category}
            onValueChange={(itemValue) => {
              setForm((prev) => ({ ...prev, category: itemValue }));
            }}
            style={{ flex: 1, color: '#FFFFFF' }}
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

      <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
        <View pointerEvents="none" className="w-full justify-center items-center">
          <FormField
            title="Date"
            value={form.date}
            handleChangeText={(e: string) => setForm((prev) => ({ ...prev, date: e }))}
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
              setForm((prev) => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
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
            <View className="bg-dark-200 rounded-xl p-6 w-4/5 border-2 border-secondary">
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
              <View className="flex-row mt-7">
                <CustomButton
                  title="Save"
                  handlePress={handleSaveCategory}
                  containerStyles="w-1/2 m-1"
                  isLoading={isSubmitting || isCatLoading}
                />
                <CustomButton
                  title="Cancel"
                  handlePress={handleCancelAddCategory}
                  containerStyles="w-1/2 m-1"
                  isLoading={isSubmitting || isCatLoading}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ExpenseForm;
