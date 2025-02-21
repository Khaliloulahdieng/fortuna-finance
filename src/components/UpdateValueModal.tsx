// src/components/UpdateValueModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface UpdateValueModalProps {
  visible: boolean;
  onClose: () => void;
  type: string;
  currentValue: number;
  onUpdate: () => void;
}

export const UpdateValueModal: React.FC<UpdateValueModalProps> = ({
  visible,
  onClose,
  type,
  currentValue,
  onUpdate
}) => {
  const [value, setValue] = useState(currentValue.toString());
  const [loading, setLoading] = useState(false);

  const getFieldName = () => {
    switch (type) {
      case 'balance': return 'currentBalance';
      case 'savings': return 'savings';
      case 'monthly': return 'monthlySavings';
      case 'debt': return 'debts';
      default: return '';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'balance': return 'Current Balance';
      case 'savings': return 'Savings';
      case 'monthly': return 'Monthly Savings';
      case 'debt': return 'Debts';
      default: return '';
    }
  };

  const handleUpdate = async () => {
    if (isNaN(Number(value))) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const fieldName = getFieldName();
      await updateDoc(doc(db, 'users', userId), {
        [fieldName]: Number(value)
      });

      onUpdate();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update value');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Update {getTitle()}</Text>
          
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Updating...' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E1E1E1',
  },
  updateButton: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});