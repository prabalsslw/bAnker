// bankerdatabase.js
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Polyfill for web
if (Platform.OS === 'web') {
  const openDatabase = SQLite.openDatabase;
  SQLite.openDatabaseAsync = async (name) => openDatabase(name);

  SQLite.SQLiteDatabase.prototype.execAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.transaction(tx => {
        tx.executeSql(sql, params, () => resolve(), (_, err) => reject(err));
      });
    });
  };

  SQLite.SQLiteDatabase.prototype.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.transaction(tx => {
        tx.executeSql(sql, params, (_, result) => resolve(result), (_, err) => reject(err));
      });
    });
  };

  SQLite.SQLiteDatabase.prototype.getAllAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.transaction(tx => {
        tx.executeSql(sql, params, (_, result) => {
          const items = [];
          for (let i = 0; i < result.rows.length; i++) {
            items.push(result.rows.item(i));
          }
          resolve(items);
        }, (_, err) => reject(err));
      });
    });
  };
} else {
  SQLite.openDatabaseAsync = async (name) => SQLite.openDatabase(name);
}

class BankerDatabase {
  constructor() {
    this.db = null;
    this.dbName = 'banker_db';
    this.userTable = 'user_tbl';
  }

  async init() {
    try {
      console.log('Initializing database...');
      this.db = await SQLite.openDatabaseAsync(this.dbName);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async createTables() {
    try {
      console.log('Creating tables...');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${this.userTable} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          pin TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async addUser(name, phone, email, pin) {
    try {
      console.log('Adding new user:', { name, phone, email });
      const result = await this.db.runAsync(
        `INSERT INTO ${this.userTable} (name, phone, email, pin) VALUES (?, ?, ?, ?)`,
        [name, phone, email, pin]
      );
      console.log('User added successfully:', result);
      return result;
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Phone number already registered');
      }
      throw error;
    }
  }

  async getUserByPhone(phone) {
    try {
      console.log('Fetching user by phone:', phone);
      const users = await this.db.getAllAsync(
        `SELECT * FROM ${this.userTable} WHERE phone = ? LIMIT 1`,
        [phone]
      );
      console.log('User fetched:', users[0] || null);
      return users[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async verifyUser(phone, pin) {
    try {
      console.log('Verifying user:', phone);
      const user = await this.getUserByPhone(phone);
      if (!user) {
        console.log('User not found');
        return false;
      }
      const isVerified = user.pin === pin;
      console.log('Verification result:', isVerified);
      return isVerified;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      console.log('Fetching all users');
      const users = await this.db.getAllAsync(
        `SELECT * FROM ${this.userTable}`
      );
      console.log('Total users:', users.length);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      console.log('Deleting user with ID:', id);
      const result = await this.db.runAsync(
        `DELETE FROM ${this.userTable} WHERE id = ?`,
        [id]
      );
      console.log('User deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async dropUserTable() {
    try {
      console.log('Dropping user_tbl...');
      await this.db.execAsync(`DROP TABLE IF EXISTS ${this.userTable};`);
      console.log('user_tbl dropped successfully');
    } catch (error) {
      console.error('Error dropping user_tbl:', error);
      throw error;
    }
  }

}

// Create and initialize a singleton instance
const bankerDB = new BankerDatabase();
bankerDB.init().catch(console.error);

export default bankerDB;