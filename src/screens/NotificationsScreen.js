import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../auth/AuthContext';
import bankerDB from '../database/bankerdatabase';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const loadNotifications = async () => {
    try {
      if (!user?.id) return;
      
      const data = await bankerDB.getNotifications(user.id);
      const count = await bankerDB.getUnreadNotificationCount(user.id);
      console.log(count);
      
      setNotifications(data);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load notifications',
        position: 'bottom',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await bankerDB.markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: 1 } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    return notificationIcons[type] || 'notifications';
  };

  const getTimeAgo = (timestamp) => {
    // Force parsing as UTC and convert to local time
    const date = moment.utc(timestamp, 'YYYY-MM-DD HH:mm:ss').local();
    return date.fromNow();
  };

  const clearAllNotifications = async () => {
    try {
      await bankerDB.db.runAsync(
        `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
        [user.id]
      );
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
      Toast.show({
        type: 'success',
        text1: 'All notifications marked as read',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to clear notifications',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
        navigation={navigation}
        showBack={false}
      />
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#e2136e']}
              tintColor="#e2136e"
            />
          }
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENT ACTIVITIES</Text>
            {unreadCount > 0 && (
              <TouchableOpacity 
                onPress={clearAllNotifications}
                style={styles.clearIcon}
              >
                <MaterialIcons name="delete-sweep" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.is_read && styles.unreadCard
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.8}
            >
              <View style={[
                  styles.iconContainer,
                  { backgroundColor: notification.is_read ? '#f0f0f0' : 'rgba(226, 19, 110, 0.1)' }
                ]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={22} 
                    color={notification.is_read ? "#888" : "#e2136e"} 
                  />
                </View>
                
                <View style={styles.contentContainer}>
                  <Text style={[
                    styles.title,
                    !notification.is_read && styles.unreadTitle
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.message}>
                    {notification.message}
                  </Text>
                  <Text style={styles.time}>
                    {getTimeAgo(notification.created_at)}
                  </Text>
                </View>
                
                {!notification.is_read && (
                  <View style={styles.unreadIndicator}>
                    <View style={styles.unreadDot} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          
          <View style={styles.bottomSpace} />
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
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 12,
    marginBottom: 16,
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
    height: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  clearIcon: {
    padding: 5,
    color: '#e2136e',
  },
});

export default NotificationsScreen;