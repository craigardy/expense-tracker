import { useState } from 'react';
import { addExpense, getExpensesByUser } from '../services/expense';

export function useExpenses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);

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

  const getUserExpenses = async () => {
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
  };

  return { expenses, isLoading, error, addNewExpense, getUserExpenses };
}
