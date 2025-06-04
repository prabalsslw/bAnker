import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import bankerDB from '../database/bankerdatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // must be null initially
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoggedInPhone, setLastLoggedInPhone] = useState(null);

   useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Load both user and last phone in parallel
        const [userData, phone] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('lastLoggedInPhone')
        ]);
        
        if (userData) setUser(JSON.parse(userData));
        if (phone) setLastLoggedInPhone(phone);
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (userData) => {
    try {
      await bankerDB.createNotification(userData.id, {
        type: 'login',
        title: 'Login Activity',
        message: 'You have successfully logged in to your account'
      });

      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(userData)),
        AsyncStorage.setItem('lastLoggedInPhone', userData.phone)
      ]);
      setUser(userData);
      setLastLoggedInPhone(userData.phone);
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  };

  const logout = async () => {
    try {
      await bankerDB.createNotification(user.id, {
        type: 'logout',
        title: 'Logout Activity',
        message: 'You have logged out from your account'
      });
      await AsyncStorage.removeItem('user');
      setUser(null);
      // Keep lastLoggedInPhone
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      // Merge the new data with existing user data
      const updatedUser = { ...user, ...updatedUserData };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log("🔁 Auth user changed:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, lastLoggedInPhone, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
