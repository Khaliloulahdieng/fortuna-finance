// src/components/FirebaseTest.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export const FirebaseTest = () => {
  const [status, setStatus] = useState<string>('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        
        // Test Auth
        await signInAnonymously(auth);
        
        setStatus('Firebase is connected! ✅');
      } catch (error: any) {
        console.error('Firebase test error:', error);
        setStatus(`Firebase connection error: ${error.message} ❌`);
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
  },
});