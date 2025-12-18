import { useCallback, useState } from 'react';
import {
  addExpense,
  getExpensesByUser,
  getExpensesByUserAndId,
  updateExpense,
  type UpdateExpenseInput,
} from '../services/expense';

export function useExpenses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expense, setExpense] = useState<any | null>(null);

  const addNewExpense = async (
    amount: number,
    category: string,
    date: string,
    notes?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await addExpense(amount, category, date, notes);
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExpensesByUser();
      setExpenses(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserExpenseById = useCallback(async (expenseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExpensesByUserAndId(expenseId);
      setExpense(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserExpenseById = useCallback(async (expenseId: string, updates: UpdateExpenseInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateExpense(expenseId, updates);
      setExpense(res);
      setExpenses((prev) => prev.map((e) => (e?.$id === expenseId ? res : e)));
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    expense,
    expenses,
    isLoading,
    error,
    addNewExpense,
    getUserExpenses,
    getUserExpenseById,
    updateUserExpenseById,
  };
}
