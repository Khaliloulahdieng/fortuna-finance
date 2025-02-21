// src/services/userService.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const initializeUserData = async (userId: string, email: string) => {
  try {
    // Create initial user document
    await setDoc(doc(db, "users", userId), {
      email,
      createdAt: new Date(),
      currentBalance: 0,
      savings: 0,
      monthlySavings: 0,
      debts: 0,
      // Add any other initial fields you want
    });
  } catch (error) {
    console.error("Error initializing user data:", error);
    throw error;
  }
};
