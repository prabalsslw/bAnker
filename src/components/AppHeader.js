import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const AppHeader = ({ title, navigation, showBack = false }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <MaterialIcons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#e2136e',
  },
  header: {
    height: 60,
    backgroundColor: '#e2136e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppHeader;