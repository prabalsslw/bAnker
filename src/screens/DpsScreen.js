import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { MaterialIcons } from '@expo/vector-icons'; // Matches drawer icon

const DpsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="DPS Management" navigation={navigation} showBack />
      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <MaterialIcons name="account-balance" size={60} color="#9b59b6" style={styles.icon} />
          <Text style={styles.title}>Feature Coming Soon</Text>
          <Text style={styles.subtitle}>We're excited to introduce</Text>
          <Text style={[styles.featureName, { color: '#9b59b6' }]}>Deposit Pension Scheme Tracking</Text>
          <Text style={styles.description}>
            Manage your pension contributions and track growth towards your retirement goals.
          </Text>
          <View style={[styles.notificationContainer, { backgroundColor: '#f5f0f9' }]}>
            <MaterialIcons name="notifications" size={20} color="#9b59b6" />
            <Text style={[styles.notificationText, { color: '#9b59b6' }]}>You'll be notified when it launches</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  comingSoonContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2b2d42',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9b59b6',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f0f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#9b59b6',
    marginLeft: 8,
  },
});

export default DpsScreen;