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

export const addExpense = async (amount: number, category: string, date: string, notes?: string) => {
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
      notes
    }
  });
};

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

export type UpdateExpenseInput = {
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
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
    // Is this correct? !!!!!
    rowId: expenseId, 
    data: {
      ...updates,
    },
  });
};
