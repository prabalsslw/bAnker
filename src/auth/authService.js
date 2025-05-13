import Loki from 'lokijs';
import AsyncStorage from '@react-native-async-storage/async-storage';

let db = null;
let usersCollection = null;

const DB_NAME = 'bAnkerUsers';
const COLLECTION_NAME = 'users';

const customAdapter = {
  loadDatabase: async (dbname, callback) => {
    try {
      const data = await AsyncStorage.getItem(dbname);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  },
  saveDatabase: async (dbname, dbString, callback) => {
    try {
      await AsyncStorage.setItem(dbname, dbString);
      callback(null);
    } catch (err) {
      callback(err);
    }
  },
  deleteDatabase: async (dbname, callback) => {
    try {
      await AsyncStorage.removeItem(dbname);
      callback(null);
    } catch (err) {
      callback(err);
    }
  },
};

const loadDatabase = () =>
  new Promise((resolve, reject) => {
    db = new Loki(DB_NAME, {
      adapter: customAdapter,
      autoload: true,
      autoloadCallback: () => {
        usersCollection = db.getCollection(COLLECTION_NAME);
        if (!usersCollection) {
          usersCollection = db.addCollection(COLLECTION_NAME, {
            unique: ['phone', 'email'],
          });
        }
        resolve();
      },
      autosave: true,
      autosaveInterval: 4000,
    });
  });

const getDB = async () => {
  if (!db) {
    await loadDatabase();
  }
  return { db, users: usersCollection };
};
// const clearAllUsers = async () => {
//   await getDB();
//   usersCollection.clear();
//   db.saveDatabase();
//   await AsyncStorage.removeItem('sessionUser'); // clear session too
//   console.log('[DB] All users cleared.');
// };

const authService = {
  signup: async ({ name, phone, email, pin }) => {
    console.log('[AUTH] Starting signup...');
    await getDB();

    const existingPhone = usersCollection.findOne({ phone });
    const existingEmail = usersCollection.findOne({ email });

    if (existingPhone || existingEmail) {
      throw new Error('Phone or Email already registered.');
    }

    const newUser = { name, phone, email, pin };
    usersCollection.insert(newUser);
    db.saveDatabase();

    return newUser;
  },

  login: async (phone, pin) => {
    await getDB();
    const user = usersCollection.findOne({ phone, pin });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.pin !== pin) {
      throw new Error('Invalid PIN');
    }

    await AsyncStorage.setItem('sessionUser', JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await AsyncStorage.removeItem('sessionUser');
  },

  getCurrentUser: async () => {
    const data = await AsyncStorage.getItem('sessionUser');
    return data ? JSON.parse(data) : null;
  },
};

export default authService;
