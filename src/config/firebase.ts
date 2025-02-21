// src/config/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXoKy6MGeoSyzt4C_CU16YCCkZ31wtPog",
  authDomain: "fortuna-native.firebaseapp.com",
  projectId: "fortuna-native",
  storageBucket: "fortuna-native.firebasestorage.app",
  messagingSenderId: "87667717547",
  appId: "1:87667717547:web:568e5815f40b6063fc8eee",
  measurementId: "G-QCVMHZ6FTE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;