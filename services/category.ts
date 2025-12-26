import { CATEGORIES_TABLE_ID, DATABASE_ID, ID, Query, tablesDB, type Models } from '../lib/appwrite';
import { getCurrentUser } from './user';

export const addCategory = async (name: string): Promise<Category> => {
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


export interface Category extends Models.Row {
  $id: string;
  name: string;
  user: string;
  $createdAt: string;
  $updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const response = await tablesDB.listRows<Category>({
    databaseId: DATABASE_ID,
    tableId: CATEGORIES_TABLE_ID,
    queries: [
      Query.equal('user', `${currentUser.$id}`)
    ]
  });

  return response.rows;
};


export const getCategoryId = async(categoryName: string): Promise<string> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('No current user found');

  const response = await tablesDB.listRows<Category>({
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

export const updateCategory = async (categoryId: string, name: string): Promise<Category> => {
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