// src/screens/TestScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export const TestScreen = () => {
  const [loading, setLoading] = useState(false);

  const testFirestore = async () => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'tests'), {
        timestamp: new Date(),
        message: 'Test successful'
      });
      alert('Firestore test successful! Document written with ID: ' + docRef.id);
    } catch (error: any) {
      console.error('Firestore Error:', error);
      alert('Firestore test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      setLoading(true);
      console.log('Starting anonymous sign in...');
      const userCredential = await signInAnonymously(auth);
      console.log('Sign in successful:', userCredential.user.uid);
      alert('Auth test successful! Anonymous user ID: ' + userCredential.user.uid);
    } catch (error: any) {
      console.error('Auth Error:', error);
      alert('Auth test failed!\nCode: ' + error.code + '\nMessage: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test Screen</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testFirestore}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Test Firestore</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Test Authentication</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.tip}>
        Note: If authentication fails, make sure Anonymous Authentication 
        is enabled in your Firebase Console.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  tip: {
    marginTop: 20,
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  }
});
