import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { MaterialIcons } from '@expo/vector-icons'; // Matches drawer icon

const ExpenseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="Expense Tracker" navigation={navigation} showBack />
      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <MaterialIcons name="analytics" size={60} color="#f39c12" style={styles.icon} />
          <Text style={styles.title}>Feature Coming Soon</Text>
          <Text style={styles.subtitle}>Get ready for powerful</Text>
          <Text style={[styles.featureName, { color: '#f39c12' }]}>Expense Tracking & Analytics</Text>
          <Text style={styles.description}>
            Categorize spending, set budgets, and visualize your financial habits.
          </Text>
          <View style={[styles.notificationContainer, { backgroundColor: '#fef6e9' }]}>
            <MaterialIcons name="notifications-active" size={20} color="#f39c12" />
            <Text style={[styles.notificationText, { color: '#f39c12' }]}>We'll alert you when it's available</Text>
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
    color: '#f39c12',
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
    backgroundColor: '#fef6e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#f39c12',
    marginLeft: 8,
  },
});

export default ExpenseScreen;