// src/services/firebase/auth.ts

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Service class for handling Firebase Authentication operations
 */
export const FirebaseAuthService = {
  /**
   * Creates a new user account with email and password
   * Also creates a user document in Firestore
   */
  async signUp(email: string, password: string) {
    try {
      // Create authentication record
      const userCredential = await auth().createUserWithEmailAndPassword(
        email, 
        password
      );

      // Create user document in Firestore
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          email: email,
          createdAt: new Date(),
          currentBalance: 0,
          savings: 0,
          monthlySavings: 0,
          debts: 0
        });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Signs in an existing user with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email, 
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Signs out the current user
   */
  async signOut() {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Returns the current user if logged in, null otherwise
   */
  getCurrentUser() {
    return auth().currentUser;
  }
};