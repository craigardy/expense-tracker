import { account, DATABASE_ID, ID, tablesDB, USERS_TABLE_ID, type Models } from '../lib/appwrite';

export interface User extends Models.Row {
  email: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

export const deleteCurrentSession = async () => {
  try {
    await account.deleteSession({
      sessionId: 'current'
    });
    console.log('User logged out successfully');
  } catch (error: any) {
    console.log('No active sessions to delete:', error);
  }
}

export const signIn = async (email: string, password: string): Promise<Models.Session> => {
  await deleteCurrentSession();
  return await account.createEmailPasswordSession({
    email,
    password
  });
};

export const createUser = async (email: string, password: string): Promise<User> => {
  const newAccount = await account.create({
    userId: ID.unique(),
    email,
    password
  });

  await signIn(email, password);

  const newUser = await tablesDB.createRow<User>({
    databaseId: DATABASE_ID,
    tableId: USERS_TABLE_ID,
    rowId: newAccount.$id,
    data: {
      email: newAccount.email
    }
  });

  return newUser;
};

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount.$id) throw Error;

    const currentUser = await tablesDB.getRow<User>({
      databaseId: DATABASE_ID,
      tableId: USERS_TABLE_ID,
      rowId: currentAccount.$id
    });
    if (!currentUser) throw Error;
    
    return currentUser;
  } catch (error: any) {
    console.log('Error getting current user:', error);
  }
};