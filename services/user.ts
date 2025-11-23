import { Account, Client, ID, TablesDB } from 'react-native-appwrite';
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID!;

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID!)

const tablesDB = new TablesDB(client);
const account = new Account(client);

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

export const signIn = async (email: string, password: string) => {
  await deleteCurrentSession();
  return await account.createEmailPasswordSession({
    email,
    password
  });
};

export const createUser = async (email: string, password: string) => {
  const newAccount = await account.create({
    userId: ID.unique(),
    email,
    password
  });

  await signIn(email, password);

  const newUser = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: USERS_TABLE_ID,
    rowId: newAccount.$id,
    data: {
      email: newAccount.email
    }
  });

  return newUser;
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount.$id) throw Error;

    const currentUser = await tablesDB.getRow({
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