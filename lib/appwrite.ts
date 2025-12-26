import type { Models } from 'appwrite';
import { Platform } from 'react-native';

// Define TablesDB interface with proper types
interface TablesDBInterface {
  listRows<T extends Models.Row>(params: {
    databaseId: string;
    tableId: string;
    queries?: string[];
  }): Promise<{ rows: T[]; total: number }>;
  
  createRow<T extends Models.Row = Models.Row>(params: {
    databaseId: string;
    tableId: string;
    rowId: string;
    data: Record<string, any>;
  }): Promise<T>;
  
  updateRow<T extends Models.Row = Models.Row>(params: {
    databaseId: string;
    tableId: string;
    rowId: string;
    data: Record<string, any>;
  }): Promise<T>;
  
  getRow<T extends Models.Row = Models.Row>(params: {
    databaseId: string;
    tableId: string;
    rowId: string;
  }): Promise<T>;
}

// Both SDKs have the same API, just use the right package for each platform
 
let Client: any;
let Account: any;
let TablesDB: any;
let ID: any;
let Query: any;

if (Platform.OS === 'web') {
  // Dynamic import for web SDK
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const appwrite = require('appwrite');
  Client = appwrite.Client;
  Account = appwrite.Account;
  TablesDB = appwrite.TablesDB;
  ID = appwrite.ID;
  Query = appwrite.Query;
} else {
  // Dynamic import for React Native SDK
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const appwrite = require('react-native-appwrite');
  Client = appwrite.Client;
  Account = appwrite.Account;
  TablesDB = appwrite.TablesDB;
  ID = appwrite.ID;
  Query = appwrite.Query;
}

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// Only set platform for native apps
if (Platform.OS !== 'web') {
  client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID!);
}

export const account = new Account(client);
export const tablesDB: TablesDBInterface = new TablesDB(client);

// Export Models for type definitions
export type { Models };

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID!;
export const EXPENSES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_EXPENSES_TABLE_ID!;
export const CATEGORIES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID!;

export { client, ID, Query };
export default client;
