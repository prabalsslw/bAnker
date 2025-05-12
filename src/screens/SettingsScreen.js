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
      id: 4,
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
      id: 5,
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
      id: 6,
      title: 'Help & Support',
      icon: <Feather name="help-circle" size={24} color="#e2136e" />,
      action: () => navigation.navigate('HelpSupport')
    },
    {
      id: 7,
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
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsOptions.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={item.action || (() => {})}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                {item.icon}
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              {item.toggle || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {settingsOptions.slice(5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                {item.icon}
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
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
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    paddingTop: 16,
    paddingBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#212529',
    marginLeft: 12,
  },
});

export default SettingsScreen;