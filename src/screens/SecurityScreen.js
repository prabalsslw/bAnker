import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../auth/AuthContext';
import bankerDB from '../database/bankerdatabase';
import Toast from 'react-native-toast-message';

const SecurityScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);

  const handleChangePin = async () => {
    if (newPin !== confirmPin) {
      Toast.show({
        type: 'error',
        text1: 'Pins do not match',
        position: 'bottom',
      });
      return;
    }

    if (newPin.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Pin must be 4 digits',
        position: 'bottom',
      });
      return;
    }

    try {
      const isPinValid = await bankerDB.verifyUserPin(user.id, currentPin);
      if (!isPinValid) {
        Toast.show({
          type: 'error',
          text1: 'Current pin is incorrect',
          position: 'bottom',
        });
        return;
      }

      await bankerDB.changeUserPin(user.id, newPin);
      Toast.show({
        type: 'success',
        text1: 'Pin changed successfully',
        position: 'bottom',
      });

      await bankerDB.createNotification(user.id, {
        type: 'security',
        title: 'PIN Changed',
        message: 'Your account PIN has been updated'
      });

      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setShowChangePin(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to change pin',
        text2: error.message,
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Security Settings" navigation={navigation} showBack />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PIN SETTINGS</Text>
          
          {!showChangePin ? (
            <TouchableOpacity 
              style={styles.changePinButton}
              onPress={() => setShowChangePin(true)}
            >
              <Text style={styles.changePinButtonText}>Change PIN</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.pinInputContainer}>
                <Text style={styles.pinLabel}>Current PIN</Text>
                <TextInput
                  style={styles.pinInput}
                  value={currentPin}
                  onChangeText={setCurrentPin}
                  placeholder="Enter current 4-digit PIN"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
              
              <View style={styles.pinInputContainer}>
                <Text style={styles.pinLabel}>New PIN</Text>
                <TextInput
                  style={styles.pinInput}
                  value={newPin}
                  onChangeText={setNewPin}
                  placeholder="Enter new 4-digit PIN"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
              
              <View style={styles.pinInputContainer}>
                <Text style={styles.pinLabel}>Confirm New PIN</Text>
                <TextInput
                  style={styles.pinInput}
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  placeholder="Confirm new 4-digit PIN"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleChangePin}
                >
                  <Text style={styles.buttonText}>Update PIN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowChangePin(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
    overflow: 'hidden',
  },
  bottomSpace: {
    height: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  changePinButton: {
    padding: 16,
    backgroundColor: 'rgba(226, 19, 110, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  changePinButtonText: {
    color: '#e2136e',
    fontSize: 16,
    fontWeight: '500',
  },
  pinInputContainer: {
    marginBottom: 16,
  },
  pinLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  pinInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#212529',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#e2136e',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SecurityScreen;