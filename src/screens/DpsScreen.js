import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';

const DpsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="DPS" navigation={navigation} showBack />
      <View style={styles.content}>
        <Text>DPS Screen Content</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DpsScreen;