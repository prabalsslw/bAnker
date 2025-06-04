import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as FileSystem from 'expo-file-system';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../auth/AuthContext';
import bankerDB from '../database/bankerdatabase';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const DataBackupScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [backupStatus, setBackupStatus] = useState('Not backed up');
  const [lastBackup, setLastBackup] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  const exportDataToJson = async () => {
    try {
      const savingsData = await bankerDB.getSavingsList();
      const paymentsData = await Promise.all(
        savingsData.map(async (saving) => {
          return await bankerDB.getPaymentsBySavingsId(saving.savings_id);
        })
      );

      const userData = {
        user: user,
        savings: savingsData,
        payments: paymentsData.flat()
      };

      const jsonData = JSON.stringify(userData);
      const fileUri = FileSystem.documentDirectory + `bkash_backup_${Date.now()}.json`;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      return fileUri;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const uploadToGoogleDrive = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `bkash_backup_${Date.now()}.json`,
          mimeType: 'application/json',
          parents: ['appDataFolder'] // Special folder for app data
        })
      });

      const fileMetadata = await response.json();
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileMetadata.id}?uploadType=media`;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: fileContent
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      return fileMetadata.id;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw error;
    }
  };

  const handleBackup = async () => {
    if (!accessToken) {
      await promptAsync();
      return;
    }

    setIsLoading(true);
    try {
      const fileUri = await exportDataToJson();
      const fileId = await uploadToGoogleDrive(fileUri);
      
      setBackupStatus('Backup successful');
      setLastBackup(new Date().toLocaleString());
      
      Toast.show({
        type: 'success',
        text1: 'Backup completed successfully',
        position: 'bottom',
      });
    } catch (error) {
      setBackupStatus('Backup failed');
      Toast.show({
        type: 'error',
        text1: 'Backup failed',
        text2: error.message,
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Data Backup" navigation={navigation} showBack />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="cloud-upload" size={48} color="#e2136e" style={styles.icon} />
          <Text style={styles.title}>Backup to Google Drive</Text>
          <Text style={styles.subtitle}>Securely store your data in the cloud</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusValue, 
              backupStatus === 'Backup successful' ? styles.success : styles.error]}>
              {backupStatus}
            </Text>
          </View>
          
          {lastBackup && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Last Backup:</Text>
              <Text style={styles.statusValue}>{lastBackup}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={handleBackup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {accessToken ? 'Backup Now' : 'Sign in with Google'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  statusLabel: {
    fontWeight: '600',
    color: '#6c757d',
    marginRight: 8,
  },
  statusValue: {
    color: '#212529',
  },
  success: {
    color: '#28a745',
  },
  error: {
    color: '#dc3545',
  },
  button: {
    backgroundColor: '#e2136e',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DataBackupScreen;