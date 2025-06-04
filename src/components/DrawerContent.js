import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialIcons, Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

const DrawerContent = ({ navigation }) => {
  const { user, logout } = useAuth();
  const menuItems = [
    { name: 'Home', icon: 'home', screen: 'HomeTabs' },
    { name: 'Savings', icon: 'wallet', screen: 'Savings' },
    { name: 'FDR', icon: 'linechart', screen: 'FDR' },
    { name: 'DPS', icon: 'account-balance', screen: 'DPS' },
    { name: 'Expense', icon: 'analytics', screen: 'Expense' }, // Added Expense tab
  ];

  const navigateToScreen = (screenName) => {
    if (screenName === 'HomeTabs') {
      navigation.navigate('HomeTabs', { screen: 'Home' });
    } else {
      navigation.navigate(screenName);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Profile Section */}
        <View style={styles.userInfoSection}>
          {user && (
            <>
            {/* Avatar with initials */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name
                    ?.split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>

              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.userInfoRow}>
                <Ionicons name="mail" size={16} color="#4a90e2" />
                <Text style={styles.userPhone}>{user.email}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Ionicons name="call" size={16} color="#4a90e2" />
                <Text style={styles.userPhone}>{user.phone}</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigateToScreen(item.screen)}
            >
              <View style={styles.menuIconContainer}>
                {item.icon === 'home' && <MaterialIcons name={item.icon} size={22} color="#4a90e2" />}
                {item.icon === 'wallet' && <Ionicons name={item.icon} size={22} color="#ff7e5f" />}
                {item.icon === 'linechart' && <AntDesign name={item.icon} size={22} color="#2ecc71" />}
                {item.icon === 'account-balance' && <MaterialIcons name={item.icon} size={22} color="#9b59b6" />}
                {item.icon === 'analytics' && <MaterialIcons name={item.icon} size={22} color="#f39c12" />} {/* Added Expense icon */}
              </View>
              <Text style={styles.menuItemText}>{item.name}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#95a5a6" />
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout Section */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <View style={styles.logoutContent}>
          <MaterialIcons name="logout" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Changed to very light gray background
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  userInfoSection: {
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#e2136e',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
},
avatarText: {
  fontSize: 28,
  color: '#fff',
  fontWeight: 'bold',
},
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  menuContainer: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  menuIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#34495e',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default DrawerContent;