import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New message received',
      message: 'You have a new message from John Doe',
      time: '2 mins ago',
      read: false,
      icon: 'chatbubble-ellipses',
    },
    {
      id: 2,
      title: 'Payment successful',
      message: 'Your payment of ₹2,500 was processed successfully',
      time: '1 hour ago',
      read: true,
      icon: 'card',
    },
    {
      id: 3,
      title: 'Account updated',
      message: 'Your profile information has been updated',
      time: '3 hours ago',
      read: true,
      icon: 'checkmark-circle',
    },
    {
      id: 4,
      title: 'New feature available',
      message: 'Try our new budgeting tool in the app',
      time: '1 day ago',
      read: false,
      icon: 'sparkles',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" navigation={navigation} showBackButton={true} />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>RECENT</Text>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard
            ]}
            onPress={() => markAsRead(notification.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: notification.read ? '#f0f0f0' : 'rgba(226, 19, 110, 0.1)' }
            ]}>
              <Ionicons 
                name={notification.icon} 
                size={22} 
                color={notification.read ? "#888" : "#e2136e"} 
              />
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={[
                styles.title,
                !notification.read && styles.unreadTitle
              ]}>
                {notification.title}
              </Text>
              <Text style={styles.message}>
                {notification.message}
              </Text>
              <Text style={styles.time}>
                {notification.time}
              </Text>
            </View>
            
            {!notification.read && (
              <View style={styles.unreadIndicator}>
                <View style={styles.unreadDot} />
              </View>
            )}
          </TouchableOpacity>
        ))}
        
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
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#e2136e',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#000',
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },
  unreadIndicator: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2136e',
  },
  bottomSpace: {
    height: 30,
  },
});

export default NotificationsScreen;