import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { validatePhone, validateEmail, validatePin } from '../../auth/validators';

const { height } = Dimensions.get('window');

const SignupScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  // Show success message if coming from successful signup
  React.useEffect(() => {
    if (route.params?.success) {
      Alert.alert('Success', route.params.success);
    }
  }, [route.params]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Special real-time validation for phone number
    if (name === 'phone') {
      if (value.length === 1 && !value.startsWith('0')) {
        setErrors(prev => ({ ...prev, phone: 'Must start with 0' }));
      } else if (value.length === 2 && !value.startsWith('01')) {
        setErrors(prev => ({ ...prev, phone: 'Must start with 01' }));
      } else if (value && !validatePhone(value)) {
        setErrors(prev => ({ ...prev, phone: 'Must be 11 digits starting with 013-019' }));
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors }; // Start with current errors

    if (!formData.name) {
      newErrors.name = 'Full name is required';
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Must be 11 digits starting with 013-019';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
      valid = false;
    } else if (!validatePin(formData.pin)) {
      newErrors.pin = 'PIN must be 4 digits';
      valid = false;
    }

    if (!formData.confirmPin) {
      newErrors.confirmPin = 'Please confirm your PIN';
      valid = false;
    } else if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signup(formData);
      navigation.navigate('Login', { 
        success: 'Registration successful! Please login.' 
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.errorInput]}
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name ? <Text style={styles.errorMessage}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.errorInput]}
              placeholder="01XXXXXXXXX"
              keyboardType="phone-pad"
              maxLength={11}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
            {errors.phone ? <Text style={styles.errorMessage}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="example@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            {errors.email ? <Text style={styles.errorMessage}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>PIN</Text>
            <TextInput
              style={[styles.input, errors.pin && styles.errorInput]}
              placeholder="4-digit PIN"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              value={formData.pin}
              onChangeText={(text) => handleChange('pin', text)}
            />
            {errors.pin ? <Text style={styles.errorMessage}>{errors.pin}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm PIN</Text>
            <TextInput
              style={[styles.input, errors.confirmPin && styles.errorInput]}
              placeholder="Confirm your PIN"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              value={formData.confirmPin}
              onChangeText={(text) => handleChange('confirmPin', text)}
            />
            {errors.confirmPin ? <Text style={styles.errorMessage}>{errors.confirmPin}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
    minHeight: height - 100, // Ensure form stays centered
    paddingVertical: 20,
  },
  formContainer: {
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2136e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
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
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#e2136e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#e2136e99',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
  },
  footerLink: {
    color: '#e2136e',
    fontWeight: 'bold',
  },
});

export default SignupScreen;