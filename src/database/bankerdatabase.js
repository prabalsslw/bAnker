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

      // Add savings table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS savings_tbl (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          savings_id TEXT NOT NULL UNIQUE,
          amount REAL NOT NULL,
          interest_rate REAL NOT NULL,
          issue_date TEXT NOT NULL,
          mature_date TEXT NOT NULL,
          tenure INTEGER NOT NULL,
          status TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add payments table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS payment_tbl (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          savings_id TEXT NOT NULL,
          savings_table_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          tenure INTEGER NOT NULL,
          interest_amount REAL NOT NULL,
          payment_date TEXT NOT NULL,
          payment_number INTEGER NOT NULL,
          payment_received_date TEXT NULL,
          is_paid INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (savings_table_id) REFERENCES savings_tbl(id)
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
        [name, phone, email, pin.toString()]
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
      const isVerified = user.pin.toString().trim() === pin.toString().trim();
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
      // await this.db.execAsync(`DROP TABLE IF EXISTS ${this.userTable};`);
      await this.db.execAsync(`DROP TABLE IF EXISTS payment_tbl;`);
      console.log('user_tbl dropped successfully');
    } catch (error) {
      console.error('Error dropping user_tbl:', error);
      throw error;
    }
  }

  async addSavings(savingsData) {
  try {
    const { savingsId, amount, interestRate, issueDate, matureDate, tenure } = savingsData;
    
    // Check if savings ID already exists
    const existing = await this.db.getAllAsync(
      'SELECT 1 FROM savings_tbl WHERE savings_id = ? LIMIT 1',
      [savingsId]
    );
    
    if (existing.length > 0) {
      throw new Error('Savings ID already exists');
    }

    const status = new Date(matureDate) > new Date() ? 'Active' : 'Matured';
    
    const result = await this.db.runAsync(
      `INSERT INTO savings_tbl 
      (savings_id, amount, interest_rate, issue_date, mature_date, tenure, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [savingsId, amount, interestRate, issueDate, matureDate, tenure, status]
    );
    console.log({result});

    if (!result.lastInsertRowId) {
      throw new Error('Failed to get inserted savings ID');
    }

    return {
      insertId: result.lastInsertRowId,
      savingsId,
      amount,
      interestRate,
      issueDate,
      matureDate,
      tenure
    };
  } catch (error) {
    console.error('Error adding savings:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Savings ID already exists');
    }
    throw error;
  }
}

async generatePayments(savingsResult) {
  try {
    const { insertId, savingsId, amount, interestRate, issueDate, matureDate, tenure } = savingsResult;
    
    if (!insertId) {
      throw new Error('Missing savings table ID');
    }

    const issue = new Date(issueDate);
    const mature = new Date(matureDate);
    const totalMonths = (mature.getFullYear() - issue.getFullYear()) * 12 + 
                       (mature.getMonth() - issue.getMonth());
    const paymentCount = Math.ceil(totalMonths / tenure);
    
    const payments = [];
    for (let i = 1; i <= paymentCount; i++) {
      const paymentDate = new Date(issue);
      paymentDate.setMonth(issue.getMonth() + (i * tenure));
      
      await this.db.runAsync(
        `INSERT INTO payment_tbl 
        (savings_id, savings_table_id, amount, tenure, interest_amount, payment_date, payment_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          savingsId, 
          insertId, 
          amount, 
          tenure, 
          interestRate,  // Using the exact amount from savings creation
          paymentDate.toISOString().split('T')[0],
          i
        ]
      );
    }
    
    return paymentCount;
  } catch (error) {
    console.error('Error generating payments:', error);
    throw error;
  }
}

  async getSavingsList() {
    try {
      return await this.db.getAllAsync('SELECT * FROM savings_tbl ORDER BY created_at DESC');
    } catch (error) {
      console.error('Error fetching savings:', error);
      throw error;
    }
  }

  async getPaymentsBySavingsId(savingsId) {
  try {
    console.log('Fetching payments for savings ID:', savingsId);
    const payments = await this.db.getAllAsync(
      `SELECT * FROM payment_tbl WHERE savings_id = ? ORDER BY payment_number`,
      [savingsId]
    );
    console.log('Total payments found:', payments.length);
    return payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
}

  async updatePayment(paymentId, updates) {
  try {
    const { interest_amount, payment_received_date } = updates;
    return await this.db.runAsync(
      `UPDATE payment_tbl 
      SET interest_amount = ?, 
          payment_received_date = ?,
          is_paid = ? 
      WHERE id = ?`,
      [
        interest_amount,
        payment_received_date,
        payment_received_date ? 1 : 0,
        paymentId
      ]
    );
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
}

async updateSavings(savingsData) {
  try {
    const { id, savingsId, interestRate, status } = savingsData;
    
    await this.db.runAsync(
      `UPDATE savings_tbl 
      SET savings_id = ?, 
          interest_rate = ?,
          status = ? 
      WHERE id = ?`,
      [savingsId, interestRate, status, id]
    );
    
    return true;
  } catch (error) {
    console.error('Error updating savings:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Savings ID already exists');
    }
    throw error;
  }
}

async updatePaymentsForSavings(paymentData) {
  try {
    const { savingsId, interestRate, savings_tbl_Id } = paymentData;
    
    await this.db.runAsync(
      `UPDATE payment_tbl 
      SET savings_id = ?,
      interest_amount = ? 
      WHERE savings_table_id = ?`,
      [savingsId,interestRate, savings_tbl_Id]
    );
    
    return true;
  } catch (error) {
    console.error('Error updating payments:', error);
    throw error;
  }
}

async deleteSavingsAndPayments(savingsId) {
  try {
    console.log('Deleting savings and payments for ID:', savingsId);
    
    // First delete payments to maintain referential integrity
    await this.db.runAsync(
      `DELETE FROM payment_tbl WHERE savings_table_id = ?`,
      [savingsId]
    );
    
    // Then delete the savings record
    const result = await this.db.runAsync(
      `DELETE FROM savings_tbl WHERE id = ?`,
      [savingsId]
    );
    
    console.log('Deletion successful:', result);
    return result;
  } catch (error) {
    console.error('Error deleting savings and payments:', error);
    throw error;
  }
}

}

// Create and initialize a singleton instance
const bankerDB = new BankerDatabase();
bankerDB.init().catch(console.error);

export default bankerDB;