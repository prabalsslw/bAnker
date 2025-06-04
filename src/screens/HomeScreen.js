import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../auth/AuthContext';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import bankerDB from '../database/bankerdatabase';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const notificationIcons = {
    savings: 'wallet',
    payment: 'card',
    profile: 'person',
    security: 'lock-closed',
    system: 'notifications',
    login: 'log-in',
    logout: 'log-out',
    maturity: 'calendar',
    reminder: 'alarm'
  };

  const loadData = async () => {
    try {
      if (!user?.id) return;
      
      // Load notifications from your database
      const data = await bankerDB.getNotifications(user.id);
      // Get only the 3 most recent notifications
      const recentNotifications = data.slice(0, 3);
      setNotifications(recentNotifications);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setNotificationsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const quickActions = [
    { icon: 'add-circle', name: 'Create', color: '#e2136e', screen: 'Create' },
    { icon: 'search', name: 'Search', color: '#4a90e2', screen: 'Search' },
    { icon: 'notifications', name: 'Alerts', color: '#f5a623', screen: 'Alerts' },
    { icon: 'settings', name: 'Settings', color: '#7ed321', screen: 'Settings' },
  ];

  const getNotificationIcon = (type) => {
    return notificationIcons[type] || 'notifications';
  };

  const getTimeAgo = (timestamp) => {
    // Using the same time formatting as your notification screen
    return moment.utc(timestamp, 'YYYY-MM-DD HH:mm:ss').local().fromNow();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Home" navigation={navigation} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e2136e" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Welcome Section */}
          <Animatable.View animation="fadeIn" duration={800} style={styles.welcomeContainer}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, styles.avatarInitials]}>
                <Text style={styles.initialsText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}!</Text>
            <Text style={styles.welcomeSubtext}>Here's what's happening today</Text>
          </Animatable.View>

          {/* Quick Actions */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.actionButton, { backgroundColor: action.color }]}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <MaterialIcons name={action.icon} size={28} color="#fff" />
                  <Text style={styles.actionText}>{action.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animatable.View>

          {/* Recent Activities - Updated to use actual notifications */}
          <Animatable.View animation="fadeInUp" delay={400} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {notificationsLoading ? (
              <ActivityIndicator size="small" color="#e2136e" style={styles.notificationLoader} />
            ) : (
              <View style={styles.activitiesContainer}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <View key={notification.id} style={styles.activityCard}>
                      <View style={[
                        styles.activityIcon,
                        { backgroundColor: notification.is_read ? '#f0f0f0' : 'rgba(226, 19, 110, 0.1)' }
                      ]}>
                        <Ionicons 
                          name={getNotificationIcon(notification.type)} 
                          size={16} 
                          color={notification.is_read ? "#888" : "#e2136e"} 
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={[
                          styles.activityTitle,
                          !notification.is_read && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </Text>
                        <Text style={styles.activityDescription} numberOfLines={1}>
                          {notification.message}
                        </Text>
                        <Text style={styles.activityTime}>
                          {getTimeAgo(notification.created_at)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noActivitiesText}>No recent activities</Text>
                )}
              </View>
            )}
          </Animatable.View>

          {/* Stats Overview */}
          <Animatable.View animation="fadeInUp" delay={600} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: '#e2136e' }]}>
                <Ionicons name="ios-document-text" size={24} color="#fff" />
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#4a90e2' }]}>
                <Ionicons name="ios-calendar" size={24} color="#fff" />
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#7ed321' }]}>
                <Ionicons name="ios-people" size={24} color="#fff" />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Messages</Text>
              </View>
            </View>
          </Animatable.View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#000',
  },
  notificationLoader: {
    marginVertical: 20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#e2136e',
  },
  avatarInitials: {
    backgroundColor: '#e2136e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 22,
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2136e',
    marginBottom: 10,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    color: '#e2136e',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '48%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  activitiesContainer: {
    marginTop: 10,
  },
  activityCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  noActivitiesText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    width: '32%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});

export default HomeScreen;