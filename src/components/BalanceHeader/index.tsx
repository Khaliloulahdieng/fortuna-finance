// index.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Import screens
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { Text, Button, StyleSheet } from 'react-native';
import { BalanceHeaderProps } from './types';

const BalanceHeader: React.FC<BalanceHeaderProps> = ({
  currentBalance,
  savings,
  monthlySavings,
  debts,
  onUpdateMetric,
}) => {
  return (
    <View style={styles.container}>
      <Text>Balance: {currentBalance}</Text>
      <Text>Savings: {savings}</Text>
      <Text>Monthly Savings: {monthlySavings}</Text>
      <Text>Debts: {debts}</Text>
      <Button title="Update" onPress={() => onUpdateMetric('savings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

// Define the root stack param list
export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
};

// Define the auth stack param list
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Create the navigators
const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Auth Navigator component
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F7F9FC' }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Main App component
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth Stack
          <RootStack.Screen 
            name="Auth" 
            component={AuthNavigator}
          />
        ) : (
          // App Stack
          <RootStack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// Register the app
import { registerRootComponent } from 'expo';
registerRootComponent(App);