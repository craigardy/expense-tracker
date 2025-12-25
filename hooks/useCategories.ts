
import { useState, useCallback } from 'react';
import { addCategory, Category, getCategories, updateCategory } from '../services/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNewCategory = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await addCategory(name);
      // Ensure the new category is a Category object
      const newCat: Category = { ...res, $id: res.$id, name: res.name };
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategoryById = useCallback(async (categoryId: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateCategory(categoryId, name);
      setCategories((prev) => prev.map((cat) => (cat.$id === categoryId ? { ...cat, name } : cat)));
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, error, fetchCategories, addNewCategory, updateCategoryById };
}
