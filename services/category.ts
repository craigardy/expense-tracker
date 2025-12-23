import { Client, ID, Query, TablesDB } from 'react-native-appwrite';
import { getCurrentUser } from './user';
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const CATEGORIES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID!;

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID!)

const tablesDB = new TablesDB(client);

export const addCategory = async (name: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  return await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: CATEGORIES_TABLE_ID,
    rowId: ID.unique(),
    data: {
      user: currentUser.$id,
      name
    }
  });
};


export interface Category {
  $id: string;
  name: string;
  [key: string]: any;
}

export const getCategories = async (): Promise<Category[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: CATEGORIES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`)
    ]
  });

  // Ensure each row has at least $id and name
  return response.rows.map((row: any) => ({
    $id: row.$id,
    name: row.name,
    ...row
  })) as Category[];
};


export const getCategoryId = async(categoryName: string): Promise<string> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: CATEGORIES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`),
      Query.equal('name', categoryName),
      Query.limit(1)
    ]
  });

  if (response.rows.length === 0) {
    throw new Error(`Category '${categoryName}' not found`);
  }

  return response.rows[0].$id;
};

export const updateCategory = async (categoryId: string, name: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  return await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: CATEGORIES_TABLE_ID,
    rowId: categoryId,
    data: {
      name
    }
  });
};