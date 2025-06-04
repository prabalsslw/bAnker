import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import AppHeader from '../components/AppHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
  const currentYear = new Date().getFullYear();
  

  return (
    <View style={styles.container}>
      <AppHeader title="About Banker App" navigation={navigation} showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* App Logo and Basic Info */}
          <View style={styles.appInfoContainer}>
            <View style={styles.iconContainer}>
              <Icon name="account-balance" size={50} color="#fff" />
            </View>
            <Text style={styles.appName}>Banker App</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.tagline}>Your Personal Finance Companion</Text>
          </View>

          <View style={styles.divider} />

          {/* App Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This App</Text>
            <Text style={styles.description}>
              Banker App is a comprehensive financial management tool designed to help you take control of your money. 
              With features for tracking savings, managing Fixed Deposit Receipts (FDR), monitoring Daily Expense Sheets (DPS), 
              and planning your Deposit Pension Scheme, our app provides everything you need for sound financial health.
            </Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="wallet" size={28} color="#ff7e5f" />
                <Text style={styles.featureText}>Savings</Text>
              </View>
              <View style={styles.featureItem}>
                <AntDesign name="linechart" size={28} color="#2ecc71" />
                <Text style={styles.featureText}>FDR</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="analytics" size={28} color="#f39c12" />
                <Text style={styles.featureText}>Expense</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="account-balance" size={28} color="#9b59b6" />
                <Text style={styles.featureText}>DPS</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Legal Information */}
          <View style={styles.section}>
            <Text style={styles.legalText}>
              © {currentYear} Banker App. All rights reserved.
            </Text>
            <Text style={styles.legalNote}>
              This application is developed for personal financial management. 
              All financial data remains on your device unless explicitly shared.
            </Text>
          </View>
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
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    backgroundColor: '#4361ee',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2d42',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#4361ee',
    fontWeight: '500',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2b2d42',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  legalText: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 16,
  },
  legalNote: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});

export default AboutScreen;