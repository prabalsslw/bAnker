import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import AppHeader from '../components/AppHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import bankerDB from '../database/bankerdatabase';

const PaymentDetailsScreen = ({ route, navigation }) => {
  const { savingsId, matureDate } = route.params;
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const paymentList = await bankerDB.getPaymentsBySavingsId(savingsId);
      setPayments(paymentList);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  // Calculate all financial summaries
  const calculateFinancials = () => {
    const paidPayments = payments.filter(p => p.is_paid);
    const unpaidPayments = payments.filter(p => !p.is_paid);
    
    return {
      totalInterest: payments.reduce((sum, p) => sum + (p.interest_amount || 0), 0),
      paidCount: paidPayments.length,
      paidInterest: paidPayments.reduce((sum, p) => sum + (p.interest_amount || 0), 0),
      unpaidCount: unpaidPayments.length,
      unpaidAmount: unpaidPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      unpaidInterest: unpaidPayments.reduce((sum, p) => sum + (p.interest_amount || 0), 0)
    };
  };

  const financials = calculateFinancials();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && editingPayment) {
      const updatedPayment = {
        ...editingPayment,
        payment_received_date: selectedDate.toISOString().split('T')[0]
      };
      setEditingPayment(updatedPayment);
    }
  };

  const handleSavePayment = async () => {
    try {
      if (!editingPayment) return;
      
      await bankerDB.updatePayment(editingPayment.id, {
        interest_amount: editingPayment.interest_amount,
        payment_received_date: editingPayment.payment_received_date
      });
      loadPayments();
      setEditingPayment(null);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Payment #{item.payment_number}</Text>
        <Text style={[
          styles.cardStatus,
          { color: item.is_paid ? '#4CAF50' : '#e2136e' }
        ]}>
          {item.is_paid ? 'Paid' : 'Pending'}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Amount:</Text>
        <Text style={styles.cardValue}>{item.amount} TK</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Interest:</Text>
        {editingPayment?.id === item.id ? (
          <TextInput
            style={styles.input}
            value={String(editingPayment.interest_amount)}
            onChangeText={(text) => {
              const value = text === '' ? '' : parseFloat(text);
              setEditingPayment({
                ...editingPayment,
                interest_amount: isNaN(value) ? 0 : value
              });
            }}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.cardValue}>{item.interest_amount} TK</Text>
        )}
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Payment Date:</Text>
        <Text style={styles.cardValue}>{item.payment_date}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Received Date:</Text>
        {editingPayment?.id === item.id ? (
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDateField('payment_received_date');
              setShowDatePicker(true);
            }}
          >
            <Text>{editingPayment.payment_received_date || 'Select Date'}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.cardValue}>{item.payment_received_date || 'Not Paid'}</Text>
        )}
      </View>

      <View style={styles.cardActions}>
        {editingPayment?.id === item.id ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleSavePayment}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}
              onPress={() => setEditingPayment(null)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#e2136e' }]}
            onPress={() => setEditingPayment(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Details" navigation={navigation} showBack />
      
      <View style={styles.content}>
        {/* Financial Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Savings ID:</Text>
            <Text style={styles.summaryValue}>{savingsId}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mature Date:</Text>
            <Text style={styles.summaryValue}>{matureDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Payments:</Text>
            <Text style={styles.summaryValue}>{payments.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paid Payments:</Text>
            <Text style={styles.summaryValue}>{financials.paidCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Unpaid Payments:</Text>
            <Text style={styles.summaryValue}>{financials.unpaidCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Paid Interest:</Text>
            <Text style={styles.summaryValue}>{financials.paidInterest.toFixed(2)} TK</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Unpaid Interest:</Text>
            <Text style={styles.summaryValue}>{financials.unpaidInterest.toFixed(2)} TK</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 }]}>
            <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total Interest:</Text>
            <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>{financials.totalInterest.toFixed(2)} TK</Text>
          </View>
        </View>

        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {showDatePicker && (
          <DateTimePicker
            value={editingPayment?.payment_received_date ? new Date(editingPayment.payment_received_date) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
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
    padding: 15,
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 14,
  },
  summaryValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
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
  },
  cardTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  cardLabel: {
    color: '#666',
    fontSize: 14,
    width: '40%',
  },
  cardValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    width: '60%',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '60%',
    textAlign: 'right',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '60%',
    alignItems: 'flex-end',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default PaymentDetailsScreen;