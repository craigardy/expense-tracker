import { Client, ID, Query, TablesDB } from 'react-native-appwrite';
import { getCategoryId } from './category';
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
  const categoryId = await getCategoryId(category);

  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: EXPENSES_TABLE_ID,
    rowId: ID.unique(),
    data: {
      user: currentUser.$id,
      amount,
      category: categoryId,
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
