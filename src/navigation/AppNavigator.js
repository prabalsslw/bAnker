import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import DrawerContent from '../components/DrawerContent';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import SavingsScreen from '../screens/SavingsScreen';
import FdrScreen from '../screens/FdrScreen';
import DpsScreen from '../screens/DpsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator 
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
        <Drawer.Screen name="Savings" component={SavingsScreen} />
        <Drawer.Screen name="FDR" component={FdrScreen} />
        <Drawer.Screen name="DPS" component={DpsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;