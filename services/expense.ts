import { DATABASE_ID, EXPENSES_TABLE_ID, ID, Query, tablesDB, type Models } from '../lib/appwrite';
import { getCurrentUser } from './user';

export interface Expense extends Models.Row {
  user: string;
  amount: number;
  category: string;
  date: string;
  year: number;
  month: number;
  notes?: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}


export const getExpensesByUser = async (): Promise<Expense[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`)
    ]

  });
  return response.rows;
};

export const getExpensesByUserAndId = async (expenseId: string): Promise<Expense> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`),
      Query.equal('$id', expenseId)
    ]

  });
  return response.rows[0];
};

export type ExpenseMonth = {
  year: number;
  month: number;
};

export type ExpenseYear = {
  year: number;
};

export const getUniqueExpenseDatesByUser = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`),
      Query.orderDesc('year'),
      Query.orderDesc('month'),
      Query.limit(1000),
    ]
  });
  const monthMap = new Map<string, ExpenseMonth>();
  const yearSet = new Set<number>();

  response.rows.forEach((expense) => {
    const year = expense.year;
    const month = expense.month;
    const monthKey = `${year}-${month}`;
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { year, month });
    }
    yearSet.add(year);
  });

  const months = Array.from(monthMap.values()).sort(
    (a, b) =>
      a.year !== b.year
        ? b.year - a.year
        : b.month - a.month
  );

  const years = [...yearSet]
    .sort((a, b) => b - a)
    .map(year => ({ year }));

  return {
    months,
    years,
  };
};

export const getExpensesByUserAndYear = async (year: number): Promise<Expense[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`),
      Query.equal('year', year),
    ]
  });
  return response.rows;
};

export const getExpensesByUserAndMonth = async (year: number, month: number): Promise<Expense[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`),
      Query.equal('year', year),
      Query.equal('month', month),
    ]
  });
  return response.rows;
};

export type UpdateExpenseInput = {
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
  year?: number;
  month?: number;
};

export const addExpense = async (amount: number, category: string, date: string, year: number, month: number, notes?: string): Promise<Expense> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  return await tablesDB.createRow<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    rowId: ID.unique(),
    data: {
      user: currentUser.$id,
      amount,
      category, 
      date,
      year,
      month,
      notes
    }
  });
};

export const updateExpense = async (expenseId: string, updates: UpdateExpenseInput): Promise<Expense> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const existing = await getExpensesByUserAndId(expenseId);
  if (!existing) throw new Error('Expense not found');
  if (existing.user !== currentUser.$id) {
    throw new Error('Not authorized to update this expense');
  }

  return await tablesDB.updateRow<Expense>({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    rowId: expenseId,
    data: {
      ...updates,
    },
  });
};
