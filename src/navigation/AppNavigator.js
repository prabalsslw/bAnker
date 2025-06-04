import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';

import DrawerContent from '../components/DrawerContent';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import SavingsScreen from '../screens/SavingsScreen';
import FdrScreen from '../screens/FdrScreen';
import DpsScreen from '../screens/DpsScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PaymentDetailsScreen from '../screens/PaymentDetailsScreen';
import AccountSettings from '../screens/AccountSettings';
import SecurityScreen from '../screens/SecurityScreen';
import DataBackupScreen from '../screens/DataBackupScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpAndSupportScreen from '../screens/HelpAndSupportScreen';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../auth/AuthContext';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator 
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

const SavingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SavingsMain" component={SavingsScreen} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettings}/>
      <Stack.Screen name="DataBackup" component={DataBackupScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="AboutApp" component={AboutScreen} />
      <Stack.Screen name="HelpSupport" component={HelpAndSupportScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
console.log("🧭 AppNavigator user:", user);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e2136e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          drawerContent={props => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerPosition: 'right',
            drawerStyle: {
              width: '80%',
              marginTop: StatusBar.currentHeight,
              backgroundColor: 'white',
            },
          }}
        >
          <Drawer.Screen name="HomeTabs" component={HomeTabs} />
          <Drawer.Screen name="Savings" component={SavingsStack} />
          <Drawer.Screen name="FDR" component={FdrScreen} />
          <Drawer.Screen name="DPS" component={DpsScreen} />
          <Drawer.Screen name="Expense" component={ExpenseScreen} />
        </Drawer.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
