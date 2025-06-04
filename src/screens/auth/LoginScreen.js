import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { validatePhone, validatePin } from '../../auth/validators';
import { useAuth } from '../../auth/AuthContext';
import bankerDB from '../../database/bankerdatabase';
import * as LocalAuthentication from 'expo-local-authentication';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({ phone: '', pin: '' });
  const [errors, setErrors] = useState({ phone: '', pin: '', auth: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showBiometricOption, setShowBiometricOption] = useState(false);
  const [showBiometricIcon, setShowBiometricIcon] = useState(false);

  const { login, lastLoggedInPhone } = useAuth();

  // Pre-populate phone number if available
  useEffect(() => {
    console.log('Last logged in phone from context:', lastLoggedInPhone);
    if (lastLoggedInPhone) {
      console.log('Setting phone number in form:', lastLoggedInPhone);
      setFormData(prev => ({ ...prev, phone: lastLoggedInPhone }));
    }
  }, [lastLoggedInPhone]);

  // useEffect(() => {
  //   const checkBiometric = async () => {
  //     const hasHardware = await LocalAuthentication.hasHardwareAsync();
  //     const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  //     setBiometricAvailable(hasHardware && isEnrolled);
  //   };
  //   checkBiometric();
  // }, []);
  useEffect(() => {
  const checkBiometricStatus = async () => {
    if (formData.phone && formData.phone.length === 11) {
      try {
        // 1. Check if user exists with this phone
        const user = await bankerDB.getUserByPhone(formData.phone);
        
        // 2. Verify if biometric is enabled for this user
        if (user?.biometric_enabled) {
          // 3. Check device biometric capability
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          
          setShowBiometricIcon(hasHardware && isEnrolled);
        } else {
          setShowBiometricIcon(false);
        }
      } catch (error) {
        console.error('Biometric check error:', error);
        setShowBiometricIcon(false);
      }
    } else {
      setShowBiometricIcon(false);
    }
  };

  checkBiometricStatus();
}, [formData.phone]);

  useEffect(() => {
    if (formData.phone && formData.phone.length === 11) {
      checkUserBiometricStatus();
    } else {
      setShowBiometricOption(false);
    }
  }, [formData.phone]);

  useEffect(() => {
    if (route.params?.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: route.params.success,
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  }, [route.params]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.auth) {
      setErrors(prev => ({ ...prev, [name]: '', auth: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { phone: '', pin: '', auth: '' };

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '11 digits starting with 013-019';
      valid = false;
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
      valid = false;
    } else if (!validatePin(formData.pin)) {
      newErrors.pin = '4 digits required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const isValid = await bankerDB.verifyUser(formData.phone, formData.pin);
      
      if (isValid) {
        const user = await bankerDB.getUserByPhone(formData.phone);
        login(user);

        Toast.show({
          type: 'success',
          text1: 'Login successful!',
          position: 'bottom',
          visibilityTime: 1000,
        });
      } else {
        setErrors({ ...errors, auth: 'Invalid phone or PIN' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ ...errors, auth: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserBiometricStatus = async () => {
    try {
      const user = await bankerDB.getUserByPhone(formData.phone);
      setShowBiometricOption(user?.biometric_enabled && biometricAvailable);
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (result.success) {
        const user = await bankerDB.getUserByPhone(formData.phone);
        if (user) {
          login(user);
          Toast.show({
            type: 'success',
            text1: 'Login successful!',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Biometric authentication failed',
        position: 'bottom',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.logo}>bAnker</Text>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, (errors.phone || errors.auth) && styles.errorInput]}
                placeholder="01XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={formData.phone}
                // onChangeText={(text) => handleChange('phone', text)}
                onChangeText={(text) => {
    console.log('Phone input changed:', text);
    handleChange('phone', text);
  }}
              />
              {errors.phone ? <Text style={styles.errorMessage}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN</Text>
              <View style={styles.pinInputContainer}>
                <TextInput
                  style={[
                    styles.pinInput, 
                    (errors.pin || errors.auth) && styles.errorInput,
                    showBiometricIcon && { paddingRight: 40 } // Add padding for icon
                  ]}
                  placeholder="4-digit PIN"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  value={formData.pin}
                  onChangeText={(text) => handleChange('pin', text)}
                />
                {showBiometricIcon && (
                  <TouchableOpacity 
                    style={styles.biometricIcon}
                    onPress={handleBiometricLogin}
                  >
                    <Ionicons name="finger-print" size={24} color="#e2136e" />
                  </TouchableOpacity>
                )}
              </View>
              {errors.pin ? <Text style={styles.errorMessage}>{errors.pin}</Text> : null}
              {errors.auth ? (
                <Text style={[styles.errorMessage, { marginTop: 8 }]}>
                  {errors.auth}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    width: '100%',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2136e',
    textAlign: 'center',
    marginBottom: 6,
  },
  formContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pinInputContainer: {
    position: 'relative',
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  biometricIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorInput: {
    borderColor: '#ff4d4f',
  },
  errorMessage: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#e2136e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
    fontSize: 14,
  },
  footerLink: {
    color: '#e2136e',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LoginScreen;