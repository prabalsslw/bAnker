import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { validatePhone, validatePin, validateEmail } from '../../auth/validators';
import bankerDB from '../../database/bankerdatabase';

const { height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: '',
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      pin: '',
      confirmPin: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 11 digits starting with 013-019';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.pin.trim()) {
      newErrors.pin = 'PIN is required';
      isValid = false;
    } else if (!validatePin(formData.pin)) {
      newErrors.pin = 'PIN must be 4 digits';
      isValid = false;
    }

    if (!formData.confirmPin.trim()) {
      newErrors.confirmPin = 'Confirm PIN is required';
      isValid = false;
    } else if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await bankerDB.addUser(
        formData.name,
        formData.phone,
        formData.email,
        formData.pin
      );

      // Alert.alert(
      //   'User Info Submitted',
      //   `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`,
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => navigation.replace('Login'),
      //     },
      //   ]
      // );

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Please log in with your PIN',
        position: 'top',
      });
      navigation.replace('Login')
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message || 'Could not create account',
        position: 'top',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.logo}>bAnker</Text>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Fill in your details</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.errorInput]}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
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
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.errorInput]}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>PIN</Text>
                <TextInput
                  style={[styles.input, errors.pin && styles.errorInput]}
                  placeholder="4-digit PIN"
                  secureTextEntry
                  maxLength={4}
                  keyboardType="numeric"
                  value={formData.pin}
                  onChangeText={(text) => handleChange('pin', text)}
                />
                {errors.pin ? <Text style={styles.errorText}>{errors.pin}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm PIN</Text>
                <TextInput
                  style={[styles.input, errors.confirmPin && styles.errorInput]}
                  placeholder="Re-enter PIN"
                  secureTextEntry
                  maxLength={4}
                  keyboardType="numeric"
                  value={formData.confirmPin}
                  onChangeText={(text) => handleChange('confirmPin', text)}
                />
                {errors.confirmPin ? (
                  <Text style={styles.errorText}>{errors.confirmPin}</Text>
                ) : null}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  errorInput: {
    borderColor: '#ff4d4f',
  },
  errorText: {
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

export default SignupScreen;
