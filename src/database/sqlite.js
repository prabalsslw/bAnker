// src/database/sqlite.js
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

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

export default SQLite;

