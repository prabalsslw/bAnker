import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AppHeader from '../components/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import Toast from 'react-native-toast-message';
import bankerDB from '../database/bankerdatabase';

const AccountSettings = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
  try {
    // Update in database
    await bankerDB.updateUserProfile(user.id, { name, email });

    await bankerDB.createNotification(user.id, {
      type: 'profile',
      title: 'Profile Updated',
      message: 'Your profile information has been updated'
    });
    
    // Update in context (and AsyncStorage)
    const success = await updateUser({ name, email });
    
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
        position: 'bottom',
      });
      setEditing(false);
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to update profile',
      text2: error.message,
      position: 'bottom',
    });
  }
};

  return (
    <View style={styles.container}>
      <AppHeader title="Account Settings" navigation={navigation} showBack />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE INFORMATION</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.infoValue}>{email}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
          
          {editing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setEditing(true)}
            >
              <MaterialIcons name="edit" size={20} color="#e2136e" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
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
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#212529',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2136e',
    borderRadius: 8,
    marginTop: 10,
  },
  editButtonText: {
    color: '#e2136e',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
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

export default AccountSettings;