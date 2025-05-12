import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';

const FdrScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="FDR" navigation={navigation} showBack />
      <View style={styles.content}>
        <Text>FDR Screen Content</Text>
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

export default FdrScreen;