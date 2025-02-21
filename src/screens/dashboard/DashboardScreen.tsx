// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
export { default as BalanceHeader } from './BalanceHeader';
export { default as MetricCard } from './MetricCard';
export * from './types';

interface UserData {
  currentBalance: number;
  savings: number;
  monthlySavings: number;
  debts: number;
}

export const DashboardScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log('No user ID found');
        return;
      }

      console.log('Fetching data for user:', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        console.log('User data found:', userDoc.data());
        setUserData(userDoc.data() as UserData);
      } else {
        console.log('No user document found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleUpdateMetric = (type: string) => {
    console.log('Update metric:', type);
    // We'll implement this later
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userData ? (
          <BalanceHeader
            currentBalance={userData.currentBalance}
            savings={userData.savings}
            monthlySavings={userData.monthlySavings}
            debts={userData.debts}
            onUpdateMetric={handleUpdateMetric}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Could not load your financial data.
              Pull down to refresh and try again.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
  },
});