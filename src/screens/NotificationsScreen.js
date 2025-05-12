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
      message: 'Your payment was processed',
      time: '1 hour ago',
      read: true,
      icon: 'card',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" navigation={navigation} />
      
      <ScrollView style={styles.scrollContainer}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard
            ]}
            onPress={() => markAsRead(notification.id)}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={notification.icon} 
                size={20} 
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
              <View style={styles.unreadDot} />
            )}
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#e2136e',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 2,
  },
  unreadTitle: {
    color: '#000',
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2136e',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default NotificationsScreen;