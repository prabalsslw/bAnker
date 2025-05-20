import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const BottomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        let IconComponent;
        
        if (route.name === 'Home') {
          IconComponent = MaterialIcons;
          iconName = isFocused ? 'home' : 'home-filled'; // Changed to outline variant
        } else if (route.name === 'Notifications') {
          IconComponent = Ionicons;
          iconName = isFocused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Settings') {
          IconComponent = Feather;
          iconName = 'settings';
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={styles.iconContainer}>
              <IconComponent 
                name={iconName} 
                size={28}  // Increased from 24 to 28
                color={isFocused ? '#e2136e' : '#666'} 
              />
              {isFocused && <View style={styles.activeDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,  // Slightly increased height to accommodate larger icons
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    padding: 4,
  },
  activeDot: {
    width: 6,  // Slightly larger dot
    height: 6,  // Slightly larger dot
    borderRadius: 3,
    backgroundColor: '#e2136e',
    marginTop: 4,
  },
});

export default BottomTabBar;