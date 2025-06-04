import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/AuthContext';
import Toast from 'react-native-toast-message';
import bankerDB from './src/database/bankerdatabase';

export default function App() {
  // useEffect(() => {
  //   const dropAndInitDB = async () => {
  //     try {
  //       await bankerDB.dropUserTable();
  //       console.log('✅ user_tbl dropped');

  //       // Optional: recreate table
  //       await bankerDB.createTables();
  //       console.log('✅ user_tbl recreated');
  //     } catch (error) {
  //       console.error('❌ Error dropping table:', error);
  //     }
  //   };

  //   dropAndInitDB();
  // }, []);
  //
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#e2136e" />
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
