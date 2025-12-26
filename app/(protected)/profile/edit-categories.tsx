import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategories } from '../../../hooks/useCategories';

interface EditableCategory {
  $id: string;
  name: string;
  originalName: string;
}

const EditCategories = () => {
  const router = useRouter();
  const { categories, fetchCategories, updateCategoryById, isLoading } = useCategories();
  const [editableCategories, setEditableCategories] = useState<EditableCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  React.useEffect(() => {
    if (categories.length > 0) {
      setEditableCategories(
        categories.map((cat) => ({
          $id: cat.$id,
          name: cat.name,
          originalName: cat.name,
        }))
      );
    }
  }, [categories]);

  const handleCategoryNameChange = (id: string, newName: string) => {
    setEditableCategories((prev) =>
      prev.map((cat) => (cat.$id === id ? { ...cat, name: newName } : cat))
    );
  };

  const hasChanges = () => {
    return editableCategories.some((cat) => cat.name !== cat.originalName);
  };

  const handleSave = async () => {
    const changedCategories = editableCategories.filter(
      (cat) => cat.name !== cat.originalName && cat.name.trim() !== ''
    );

    if (changedCategories.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('No categories have been modified.');
      } else {
        Alert.alert('No Changes', 'No categories have been modified.');
      }
      return;
    }

    setIsSaving(true);
    try {
      // Update all changed categories
      for (const cat of changedCategories) {
        await updateCategoryById(cat.$id, cat.name.trim());
      }
      if (Platform.OS === 'web') {
        window.alert('Categories updated successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Categories updated successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message || 'Failed to update categories'}`);
      } else {
        Alert.alert('Error', error.message || 'Failed to update categories');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (Platform.OS === 'web') {
        if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
          router.back();
        }
      } else {
        Alert.alert(
          'Discard Changes?',
          'You have unsaved changes. Are you sure you want to go back?',
          [
            {
              text: 'Stay',
              style: 'cancel',
            },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } else {
      router.back();
    }
  };

  if (isLoading && editableCategories.length === 0) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full flex-1 px-4 items-center justify-center">
          <Text className="text-white text-lg">Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex-1 px-4 items-center">
        {/* <Image source={images.appLogo} className="w-[130px] h-[84px]" resizeMode="contain" /> */}
        <View className="w-full flex-1 pb-8">
          <View className="bg-dark-200 rounded-xl p-6 w-full border-2 border-secondary flex-1">
            <Text className="text-gray-300 text-sm mb-4">
              Tap on any category name to edit it
            </Text>
            
            <FlatList
              data={editableCategories}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <View className="mb-4 bg-dark-100 rounded-lg p-4 border border-gray-700">
                  <Text className="text-gray-400 text-xs mb-2">{item.name}</Text>
                  <TextInput
                    className="text-white text-base bg-dark-200 px-3 py-2 rounded-lg border border-secondary"
                    value={item.name}
                    onChangeText={(text) => handleCategoryNameChange(item.$id, text)}
                    placeholder="Enter category name"
                    placeholderTextColor="#7b7b8b"
                  />
                </View>
              )}
              ListEmptyComponent={() => (
                <View className="justify-center items-center">
                  <Text className="text-gray-300 text-lg mt-4">No categories found.</Text>
                  <Text className="text-gray-400 text-sm mt-2">
                    Add categories from the Add Expense screen.
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Action Buttons */}
          <View className="mt-4 space-y-3 pb-2">
            <TouchableOpacity
              onPress={handleSave}
              className={`mt-4  rounded-xl min-h-[62px] w-full justify-center items-center ${
                hasChanges() && !isSaving ? 'bg-secondary' : 'bg-gray-600'
              }`}
              activeOpacity={0.8}
              disabled={!hasChanges() || isSaving}
            >
              <Text className="text-white font-semibold text-lg">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

              <TouchableOpacity
            onPress={handleCancel}
            className="mt-4 bg-secondary rounded-xl min-h-[62px] w-full justify-center items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditCategories;