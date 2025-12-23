import { Client, ID, Query, TablesDB } from 'react-native-appwrite';
import { getCurrentUser } from './user';
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const EXPENSES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_EXPENSES_TABLE_ID!;

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID!)

const tablesDB = new TablesDB(client);


export const getExpensesByUser = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`)
    ]

  });
  return response.rows;
};

export const getExpensesByUserAndId = async (expenseId: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  const response = await tablesDB.listRows({
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
  const response = await tablesDB.listRows({
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
}

export type UpdateExpenseInput = {
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
  year?: number;
  month?: number;
};

export const addExpense = async (amount: number, category: string, date: string, year: number, month: number, notes?: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    rowId: ID.unique(),
    data: {
      user: currentUser.$id,
      amount,
      category, // use the ID directly
      date,
      year,
      month,
      notes
    }
  });
};

export const updateExpense = async (expenseId: string, updates: UpdateExpenseInput) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const existing = await getExpensesByUserAndId(expenseId);
  if (!existing) throw new Error('Expense not found');
  if (existing.user !== currentUser.$id) {
    throw new Error('Not authorized to update this expense');
  }

  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    rowId: expenseId,
    data: {
      ...updates,
    },
  });
};
