import { useCallback, useState } from 'react';
import {
  addExpense,
  getExpensesByUser,
  getExpensesByUserAndId,
  getExpensesByUserAndMonth,
  getExpensesByUserAndYear,
  getUniqueExpenseDatesByUser,
  updateExpense,
  type UpdateExpenseInput,
} from '../services/expense';

export interface ExpenseMonth {
  month: number;
  year: number;
}

export interface UniqueExpenseDates {
  months: ExpenseMonth[];
  years: { year: number }[];
}

export function useExpenses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expense, setExpense] = useState<any | null>(null);
  const [dates, setDates] = useState<UniqueExpenseDates | null>(null);


  // GETING
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

  const getUniqueUserExpenseDates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUniqueExpenseDatesByUser();
      setDates(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expense dates');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserExpensesByDate = useCallback(async (year: number, month?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (month !== undefined) {
        const res = await getExpensesByUserAndMonth(year, month);
        setExpenses(res);
      } else {
        const res = await getExpensesByUserAndYear(year);
        setExpenses(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses by date');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  // ADDING & UPDATING
  const addNewExpense = async (
    amount: number,
    category: string,
    date: string,
    notes?: string
  ) => {
    setIsLoading(true);
    setError(null);
    const [year, month, day] = date.split('-').map(Number);
    try {
      const res = await addExpense(amount, category, date, year, month, notes);
      return res;
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserExpenseById = useCallback(async (expenseId: string, updates: UpdateExpenseInput) => {
    setIsLoading(true);
    setError(null);
    if (updates.date) {
      const [year, month, day] = updates.date.split('-').map(Number);
      updates = { ...updates, year, month };
    }

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
    dates,
    isLoading,
    error,

    getUserExpenses,
    getUserExpenseById,
    getUniqueUserExpenseDates,
    addNewExpense,
    updateUserExpenseById,
    getUserExpensesByDate,
  };
}
