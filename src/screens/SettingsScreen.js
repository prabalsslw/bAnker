import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../auth/AuthContext';
import bankerDB from '../database/bankerdatabase';
import AppHeader from '../components/AppHeader';
import Toast from 'react-native-toast-message';

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Check biometric availability on mount
   useEffect(() => {
    const checkBiometrics = async () => {
      await checkBiometricSupport();
      await checkBiometricStatus();
    };
    checkBiometrics();
  }, [user]); // Add user as dependency

  // const checkBiometricSupport = async () => {
  //   const hasHardware = await LocalAuthentication.hasHardwareAsync();
  //   const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  //   setBiometricAvailable(hasHardware && isEnrolled);
  // };

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setBiometricAvailable(false);
    }
  };

  // const checkBiometricStatus = async () => {
  //   if (user?.id) {
  //     const status = await bankerDB.getUserBiometricStatus(user.id);
  //     setBiometricEnabled(status);
  //   }
  // };

  // const checkBiometricStatus = async () => {
  //   try {
  //     if (user?.id) {
  //       const status = await bankerDB.getUserBiometricStatus(user.id);
  //       console.log('Biometric status from DB:', status); // Debug log
  //       setBiometricEnabled(!!status); // Ensure boolean value
  //     }
  //   } catch (error) {
  //     console.error('Error checking biometric status:', error);
  //     setBiometricEnabled(false);
  //   }
  // };

  const checkBiometricStatus = async () => {
  try {
    if (user?.id) {
      const status = await bankerDB.getUserBiometricStatus(user.id);
      console.log('Biometric status from DB:', status);
      setBiometricEnabled(status);
    }
  } catch (error) {
    console.error('Error checking biometric status:', error);
    setBiometricEnabled(false);
    Toast.show({
      type: 'error',
      text1: 'Failed to check biometric status',
      position: 'bottom',
    });
  }
};

  // const handleBiometricToggle = async (value) => {
  //   if (value) {
  //     // Enable biometric
  //     try {
  //       const result = await LocalAuthentication.authenticateAsync({
  //         promptMessage: 'Authenticate to enable biometric login',
  //       });

  //       if (result.success) {
  //         await bankerDB.enableUserBiometric(user.id);
  //         setBiometricEnabled(true);
  //         Toast.show({
  //           type: 'success',
  //           text1: 'Biometric login enabled',
  //           position: 'bottom',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Biometric enable error:', error);
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Failed to enable biometric',
  //         text2: error.message,
  //         position: 'bottom',
  //       });
  //     }
  //   } else {
  //     // Disable biometric
  //     await bankerDB.disableUserBiometric(user.id);
  //     setBiometricEnabled(false);
  //   }
  // };

  const handleBiometricToggle = async (value) => {
    if (!user?.id) return;
    
    try {
      if (value) {
        // Enable biometric
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
        });

        if (result.success) {
          await bankerDB.enableUserBiometric(user.id);
          setBiometricEnabled(true);
          Toast.show({
            type: 'success',
            text1: 'Biometric login enabled',
            position: 'bottom',
          });
        } else {
          // Authentication failed, keep switch off
          setBiometricEnabled(false);
        }
      } else {
        // Disable biometric
        await bankerDB.disableUserBiometric(user.id);
        setBiometricEnabled(false);
        Toast.show({
          type: 'success',
          text1: 'Biometric login disabled',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('Biometric toggle error:', error);
      setBiometricEnabled(!value); // Revert switch state
      Toast.show({
        type: 'error',
        text1: 'Biometric operation failed',
        text2: error.message,
        position: 'bottom',
      });
    }
  };


  const settingsOptions = [
    {
      id: 1,
      title: 'Account Settings',
      icon: <MaterialIcons name="account-circle" size={24} color="#e2136e" />,
      action: () => navigation.navigate('AccountSettings') // Make sure this matches your route name
    },
    {
      id: 2,
      title: 'Security',
      icon: <Ionicons name="shield-checkmark" size={24} color="#e2136e" />,
      action: () => navigation.navigate('Security')
    },
    {
      id: 3,
      title: 'Data Backup',
      icon: <Ionicons name="cloud-upload" size={24} color="#e2136e" />,
      action: () => navigation.navigate('DataBackup')
    },
    {
      id: 4,
      title: 'Notifications',
      icon: <Ionicons name="notifications" size={24} color="#e2136e" />,
      action: null,
      toggle: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor="#fff"
          trackColor={{ false: '#767577', true: '#e2136e' }}
        />
      )
    },
    {
      id: 5,
      title: 'Dark Mode',
      icon: <Ionicons name="moon" size={24} color="#e2136e" />,
      action: null,
      toggle: (
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          thumbColor="#fff"
          trackColor={{ false: '#767577', true: '#e2136e' }}
        />
      )
    },
    {
      id: 6,
      title: 'Biometric Login',
      icon: <Ionicons name="finger-print" size={24} color="#e2136e" />,
      action: null,
      toggle: biometricAvailable ? (
        <Switch
          value={biometricEnabled}
          onValueChange={handleBiometricToggle}
          thumbColor="#fff"
          trackColor={{ false: '#767577', true: '#e2136e' }}
        />
      ) : (
        <Text style={styles.unavailableText}>Not Available</Text>
      )
    },
    {
      id: 7,
      title: 'Help & Support',
      icon: <Feather name="help-circle" size={24} color="#e2136e" />,
      action: () => navigation.navigate('HelpSupport')
    },
    {
      id: 8,
      title: 'About App',
      icon: <Ionicons name="information-circle" size={24} color="#e2136e" />,
      action: () => navigation.navigate('AboutApp')
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" navigation={navigation} />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          {settingsOptions.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          {settingsOptions.slice(3, 6).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={item.action || (() => {})}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              {item.toggle}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, styles.lastSection]}>  {/* Added style here */}
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          {settingsOptions.slice(6).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Added empty space at the bottom */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  lastSection: {
    marginBottom: 10,  // Added extra margin for the last section
  },
  bottomSpace: {
    height: 15,  // Added space at the bottom
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f1f1',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(226, 19, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  unavailableText: {
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
});

export default SettingsScreen;