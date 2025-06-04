import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import AppHeader from '../components/AppHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

const HelpAndSupportScreen = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:prabalsslw@gmail.com');
  };

  const openLinkedIn = () => {
    Linking.openURL('https://linkedin.com/in/prabal-mallick');
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/prabal-mallick');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Help & Support" navigation={navigation} showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Developer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer Information</Text>
            
            <View style={styles.infoItem}>
              <Icon name="person" size={24} color="#4361ee" />
              <Text style={styles.infoText}>Prabal Mallick</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="work" size={24} color="#4361ee" />
              <Text style={styles.infoText}>Software Developer</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="email" size={24} color="#4361ee" />
              <TouchableOpacity onPress={handleEmailPress}>
                <Text style={[styles.infoText, styles.linkText]}>prabalsslw@gmail.com</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Social Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect With Developer</Text>
            
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} onPress={openLinkedIn}>
                <IconFA name="linkedin-square" size={24} color="#fff" />
                <Text style={styles.socialButtonText}>LinkedIn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.socialButton, styles.githubButton]} onPress={openGitHub}>
                <IconFA name="github" size={24} color="#fff" />
                <Text style={styles.socialButtonText}>GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <Text style={styles.supportText}>
              If you're experiencing any issues with the app or have suggestions for improvement, 
              please don't hesitate to contact the developer directly.
            </Text>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
              <Icon name="email" size={20} color="#fff" />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2b2d42',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 15,
  },
  linkText: {
    color: '#4361ee',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  socialButton: {
    backgroundColor: '#0077b5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  githubButton: {
    backgroundColor: '#333',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  contactButton: {
    backgroundColor: '#4361ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 16,
  },
});

export default HelpAndSupportScreen;