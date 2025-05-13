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
  Dimensions
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { validatePhone, validatePin } from '../../auth/validators';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({ phone: '', pin: '' });
  const [errors, setErrors] = useState({ phone: '', pin: '', auth: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (route.params?.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: route.params.success,
        position: 'bottom',
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

    try {
      setIsLoading(true);
      await login(formData.phone, formData.pin);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        position: 'bottom',
      });
    } catch (error) {
      const message = error?.message?.toLowerCase() || '';
      if (
        message.includes('not found') ||
        message.includes('invalid') ||
        message.includes('no user') ||
        message.includes('wrong pin')
      ) {
        setErrors(prev => ({ ...prev, auth: 'Invalid mobile number or PIN.' }));
      } else {
        setErrors(prev => ({ ...prev, auth: 'Login failed. Please try again later.' }));
      }
    } finally {
      setIsLoading(false);
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
                onChangeText={(text) => handleChange('phone', text)}
              />
              {errors.phone ? <Text style={styles.errorMessage}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN</Text>
              <TextInput
                style={[styles.input, (errors.pin || errors.auth) && styles.errorInput]}
                placeholder="4-digit PIN"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={formData.pin}
                onChangeText={(text) => handleChange('pin', text)}
              />
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
  authError: {
    color: '#ff4d4f',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
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
