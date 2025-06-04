// SavingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bankerDB from '../database/bankerdatabase';
import { useAuth } from '../auth/AuthContext';
import Toast from 'react-native-toast-message';
import { Animated, Easing } from 'react-native';

const SavingsScreen = ({ navigation }) => {
  const [savingsList, setSavingsList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [savingsToDelete, setSavingsToDelete] = useState(null);
  const { user } = useAuth();
  const [scaleValue] = useState(new Animated.Value(1));
  const [newSavings, setNewSavings] = useState({
    savingsId: '',
    amount: '',
    interestRate: '',
    tenure: '',
    issueDate: '',
    matureDate: ''
  });
  const [editingSavings, setEditingSavings] = useState({
    id: '',
    savingsId: '',
    amount: '',
    interestRate: '',
    tenure: '',
    issueDate: '',
    matureDate: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    try {
      const savings = await bankerDB.getSavingsList();
      setSavingsList(savings);
    } catch (error) {
      console.error('Error loading savings:', error);
      showToast('error', 'Failed to load savings data');
    }
  };

  const showToast = (type, text1, text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 1000,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!newSavings.savingsId.trim()) {
      newErrors.savingsId = 'Savings ID is required';
      valid = false;
    }

    if (!newSavings.amount || isNaN(newSavings.amount)) {
      newErrors.amount = 'Valid amount is required';
      valid = false;
    }

    if (!newSavings.interestRate || isNaN(newSavings.interestRate)) {
      newErrors.interestRate = 'Valid interest rate is required';
      valid = false;
    }

    if (!newSavings.tenure || isNaN(newSavings.tenure)) {
      newErrors.tenure = 'Valid tenure is required';
      valid = false;
    }

    if (!newSavings.issueDate) {
      newErrors.issueDate = 'Issue date is required';
      valid = false;
    }

    if (!newSavings.matureDate) {
      newErrors.matureDate = 'Mature date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = {};

    if (!editingSavings.savingsId.trim()) {
      newErrors.savingsId = 'Savings ID is required';
      valid = false;
    }

    if (!editingSavings.interestRate || isNaN(editingSavings.interestRate)) {
      newErrors.interestRate = 'Valid interest rate is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (isEditModalVisible) {
        setEditingSavings({...editingSavings, [dateField]: formattedDate});
      } else {
        setNewSavings({...newSavings, [dateField]: formattedDate});
      }
    }
  };

  const handleAddSavings = async () => {
    if (!validateForm()) return;

    try {
      // Add to savings table
      const savingsResult = await bankerDB.addSavings({
        savingsId: newSavings.savingsId,
        amount: parseFloat(newSavings.amount),
        interestRate: parseFloat(newSavings.interestRate),
        issueDate: newSavings.issueDate,
        matureDate: newSavings.matureDate,
        tenure: parseInt(newSavings.tenure)
      });

      // Debug log to verify we have the insertId
      console.log('Savings result:', savingsResult);
      
      // Generate payment records
      await bankerDB.generatePayments(savingsResult);

      await bankerDB.createNotification(user.id, {
        type: 'savings',
        title: 'New Savings Created',
        message: `Your savings account ${newSavings.savingsId} has been created`,
        related_id: newSavings.savingsId
      });

      // Reset form and reload data
      setNewSavings({
        savingsId: '',
        amount: '',
        interestRate: '',
        tenure: '',
        issueDate: '',
        matureDate: ''
      });
      setIsAddModalVisible(false);
      showToast('success', 'Savings and payment records created successfully');
      loadSavings();
    } catch (error) {
      console.error('Error in savings process:', error);
      if (error.message.includes('UNIQUE constraint failed') || 
          error.message.includes('Savings ID already exists')) {
        setErrors({...errors, savingsId: 'This Savings ID already exists'});
      } else if (error.message.includes('Missing savings table ID')) {
        showToast('error', 'Failed to create savings record', 'Please try again.');
      } else {
        showToast('error', 'Failed to complete savings process', 'Please try again.');
      }
    }
  };

  const handleEditSavings = (savingsItem) => {
    setEditingSavings({
      id: savingsItem.id,
      savingsId: savingsItem.savings_id,
      amount: savingsItem.amount.toString(),
      interestRate: savingsItem.interest_rate.toString(),
      tenure: savingsItem.tenure.toString(),
      issueDate: savingsItem.issue_date,
      matureDate: savingsItem.mature_date,
      status: savingsItem.status
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateSavings = async () => {
    if (!validateEditForm()) return;

    try {
      // Update savings table
      await bankerDB.updateSavings({
        id: editingSavings.id,
        savingsId: editingSavings.savingsId,
        interestRate: parseFloat(editingSavings.interestRate),
        status: editingSavings.status
      });

      await bankerDB.createNotification(user.id, {
        type: 'savings',
        title: 'Savings Updated',
        message: `Your savings account ${editingSavings.savingsId} has been updated`,
        related_id: editingSavings.savingsId
      });

      // Update related payments if interest rate changed
      await bankerDB.updatePaymentsForSavings({
        savingsId: editingSavings.savingsId,
        savings_tbl_Id: editingSavings.id,
        interestRate: parseFloat(editingSavings.interestRate)
      });

      setIsEditModalVisible(false);
      showToast('success', 'Savings updated successfully');
      loadSavings();
    } catch (error) {
      console.error('Error updating savings:', error);
      showToast('error', 'Failed to update savings', 'Please try again.');
    }
  };

  const handleDeleteSavings = (savingsItem) => {
    setSavingsToDelete(savingsItem);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteSavings = async () => {
  try {
    // Validate PIN is 4 digits
    if (!pin || pin.length !== 4 || isNaN(pin)) {
      showToast('error', 'Please enter a valid 4-digit PIN');
      return;
    }

    // Verify user pin first - use the actual logged-in user's phone number
    const currentUserPhone = user.phone; // Replace with actual logged-in user's phone if available
    const isVerified = await bankerDB.verifyUser(currentUserPhone, pin);
    
    if (!isVerified) {
      showToast('error', 'Incorrect PIN');
      return;
    }

    // Delete the savings and associated payments
    await bankerDB.deleteSavingsAndPayments(savingsToDelete.id);

    await bankerDB.createNotification(user.id, {
        type: 'savings',
        title: 'Savings Deleted',
        message: `Your savings & savings and associated payments has been deleted`,
        related_id: savingsToDelete.id
      });
    
    showToast('success', 'Savings and associated payments deleted successfully');
    setIsDeleteModalVisible(false);
    setPin('');
    setSavingsToDelete(null);
    loadSavings();
  } catch (error) {
    console.error('Error deleting savings:', error);
    showToast('error', 'Failed to delete savings');
  }
};

  const calculateTotal = () => {
    return savingsList
      .filter(item => item.status === 'Active')
      .reduce((total, item) => total + item.amount, 0);
  };


  const animateButton = () => {
  Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1.1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ]).start();
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Savings ID: <Text style={styles.boldText}>{item.savings_id}</Text></Text>
        <View style={[
          styles.statusBadge,
          { 
            backgroundColor: item.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 
                          item.status === 'Matured' ? 'rgba(226, 19, 110, 0.1)' : 'rgba(158, 158, 158, 0.1)',
            borderColor: item.status === 'Active' ? '#4CAF50' : 
                         item.status === 'Matured' ? '#e2136e' : '#9E9E9E'
          }
        ]}>
          <Text style={[
            styles.statusText,
            { 
              color: item.status === 'Active' ? '#4CAF50' : 
                    item.status === 'Matured' ? '#e2136e' : '#9E9E9E'
            }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Amount:</Text>
        <Text style={styles.cardValue}>{item.amount.toFixed(2)} Tk</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Interest Rate:</Text>
        <Text style={styles.cardValue}>{item.interest_rate} Tk</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Tenure:</Text>
        <Text style={styles.cardValue}>{item.tenure} months</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Issue Date:</Text>
        <Text style={styles.cardValue}>{item.issue_date}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Mature Date:</Text>
        <Text style={styles.cardValue}>{item.mature_date}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditSavings(item)}
        >
          <Icon name="edit" size={20} color="#e2136e" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PaymentDetails', { savingsId: item.savings_id, matureDate: item.mature_date })}
        >
          <Icon name="info-outline" size={20} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteSavings(item)}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Savings Management" navigation={navigation} showBack />
      
      <View style={styles.content}>
        {/* Grand Total at Top */}

          {savingsList.length > 0 && (
            <View style={styles.totalContainerTop}>
              <Text style={styles.totalLabel}>Total Active Savings Amount:</Text>
              <Text style={styles.totalAmount}>{calculateTotal().toFixed(2)} Tk</Text>
            </View>
          )}

          {/* Savings List or Empty State */}
          {savingsList.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="account-balance-wallet" size={120} color="#e0e0e0" style={styles.emptyImage} />
              <Text style={styles.emptyText}>No Savings Found!</Text>
              <Text style={styles.emptySubtext}>Start by adding your first savings</Text>
            </View>
          ) : (
            <FlatList
              data={savingsList}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Add Button at Bottom */}
          <Animated.View 
            style={[
              styles.addButtonBottom, 
              { 
                transform: [{ scale: scaleValue }],
              }
            ]}
          >
            <TouchableOpacity 
              onPress={() => {
                animateButton();
                setIsAddModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>

      {/* Add Savings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Savings</Text>
            
            <TextInput
              style={[styles.input, errors.savingsId && styles.inputError]}
              placeholder="Savings ID *"
              value={newSavings.savingsId}
              onChangeText={(text) => setNewSavings({...newSavings, savingsId: text})}
            />
            {errors.savingsId && <Text style={styles.errorText}>{errors.savingsId}</Text>}

            <TextInput
              style={[styles.input, errors.amount && styles.inputError]}
              placeholder="Amount *"
              keyboardType="numeric"
              value={newSavings.amount}
              onChangeText={(text) => setNewSavings({...newSavings, amount: text})}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

            <TextInput
              style={[styles.input, errors.interestRate && styles.inputError]}
              placeholder="Interest Rate *"
              keyboardType="numeric"
              value={newSavings.interestRate}
              onChangeText={(text) => setNewSavings({...newSavings, interestRate: text})}
            />
            {errors.interestRate && <Text style={styles.errorText}>{errors.interestRate}</Text>}

            <TextInput
              style={[styles.input, errors.tenure && styles.inputError]}
              placeholder="Tenure (months) *"
              keyboardType="numeric"
              value={newSavings.tenure}
              onChangeText={(text) => setNewSavings({...newSavings, tenure: text})}
            />
            {errors.tenure && <Text style={styles.errorText}>{errors.tenure}</Text>}

            <TouchableOpacity 
              style={[styles.input, styles.dateInput, errors.issueDate && styles.inputError]}
              onPress={() => {
                setDateField('issueDate');
                setShowDatePicker(true);
              }}
            >
              <Text style={!newSavings.issueDate && {color: '#999'}}>
                {newSavings.issueDate || 'Select Issue Date *'}
              </Text>
            </TouchableOpacity>
            {errors.issueDate && <Text style={styles.errorText}>{errors.issueDate}</Text>}

            <TouchableOpacity 
              style={[styles.input, styles.dateInput, errors.matureDate && styles.inputError]}
              onPress={() => {
                setDateField('matureDate');
                setShowDatePicker(true);
              }}
            >
              <Text style={!newSavings.matureDate && {color: '#999'}}>
                {newSavings.matureDate || 'Select Mature Date *'}
              </Text>
            </TouchableOpacity>
            {errors.matureDate && <Text style={styles.errorText}>{errors.matureDate}</Text>}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#e2136e' }]}
                onPress={handleAddSavings}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#9E9E9E' }]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Savings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Savings</Text>
            
            <TextInput
              style={[styles.input, errors.savingsId && styles.inputError]}
              placeholder="Savings ID *"
              value={editingSavings.savingsId}
              onChangeText={(text) => setEditingSavings({...editingSavings, savingsId: text})}
              editable={true}
            />
            {errors.savingsId && <Text style={styles.errorText}>{errors.savingsId}</Text>}

            <TextInput
              style={[styles.input, {backgroundColor: '#f5f5f5'}]}
              placeholder="Amount"
              value={editingSavings.amount}
              editable={false}
            />

            <TextInput
              style={[styles.input, errors.interestRate && styles.inputError]}
              placeholder="Interest Rate *"
              keyboardType="numeric"
              value={editingSavings.interestRate}
              onChangeText={(text) => setEditingSavings({...editingSavings, interestRate: text})}
            />
            {errors.interestRate && <Text style={styles.errorText}>{errors.interestRate}</Text>}

            <TextInput
              style={[styles.input, {backgroundColor: '#f5f5f5'}]}
              placeholder="Tenure (months)"
              value={editingSavings.tenure}
              editable={false}
            />

            <TextInput
              style={[styles.input, {backgroundColor: '#f5f5f5'}]}
              placeholder="Issue Date"
              value={editingSavings.issueDate}
              editable={false}
            />

            <TextInput
              style={[styles.input, {backgroundColor: '#f5f5f5'}]}
              placeholder="Mature Date"
              value={editingSavings.matureDate}
              editable={false}
            />

            <View style={styles.input}>
              <Text style={styles.dropdownLabel}>Status:</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    editingSavings.status === 'Active' && styles.dropdownOptionSelected
                  ]}
                  onPress={() => setEditingSavings({...editingSavings, status: 'Active'})}
                >
                  <Text style={editingSavings.status === 'Active' && {color: 'white'}}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    editingSavings.status === 'Inactive' && styles.dropdownOptionSelected
                  ]}
                  onPress={() => setEditingSavings({...editingSavings, status: 'Inactive'})}
                >
                  <Text style={editingSavings.status === 'Inactive' && {color: 'white'}}>Inactive</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    editingSavings.status === 'Matured' && styles.dropdownOptionSelected
                  ]}
                  onPress={() => setEditingSavings({...editingSavings, status: 'Matured'})}
                >
                  <Text style={editingSavings.status === 'Matured' && {color: 'white'}}>Matured</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#e2136e' }]}
                onPress={handleUpdateSavings}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#9E9E9E' }]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.deleteConfirmationText}>
              Are you sure you want to delete savings {savingsToDelete?.savings_id}?
              All associated payments will also be deleted.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter 4-digit PIN to confirm"
              secureTextEntry={true}
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={(text) => {
                if (/^\d+$/.test(text) || text === '') {
                  setPin(text);
                }
              }}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={confirmDeleteSavings}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#9E9E9E' }]}
                onPress={() => {
                  setIsDeleteModalVisible(false);
                  setPin('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    position: 'relative', // Needed for absolute positioning of button
  },
 // Update the addButtonSmall style
totalContainerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  addButtonBottom: {
    backgroundColor: '#e2136e',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  // Update emptyState if needed for better positioning
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Adjust based on your layout
  },
  
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    tintColor: '#e0e0e0',
    alignSelf: 'center',
  },
  
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40, // Adds proper padding for multi-line text
  },
  listContainer: {
    paddingBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLabel: {
    color: '#666',
    fontSize: 14,
  },
  cardValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginLeft: 16,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#e2136e',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#e2136e',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2136e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  dateInput: {
    justifyContent: 'center',
    height: 50,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownLabel: {
    marginBottom: 5,
    color: '#666',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dropdownOption: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '30%',
    alignItems: 'center',
  },
  dropdownOptionSelected: {
    backgroundColor: '#e2136e',
    borderColor: '#e2136e',
  },
  deleteConfirmationText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default SavingsScreen;