import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const settingsOptions = [
    {
      id: 1,
      title: 'Account Settings',
      icon: <MaterialIcons name="account-circle" size={24} color="#e2136e" />,
      action: () => navigation.navigate('AccountSettings')
    },
    {
      id: 2,
      title: 'Security',
      icon: <Ionicons name="shield-checkmark" size={24} color="#e2136e" />,
      action: () => navigation.navigate('SecuritySettings')
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
      toggle: (
        <Switch
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
          thumbColor="#fff"
          trackColor={{ false: '#767577', true: '#e2136e' }}
        />
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
});

export default SettingsScreen;