// src/components/BalanceHeader/MetricCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MetricCardProps } from './types';

const MetricCard: React.FC<MetricCardProps> = ({ title, amount, type }) => {
  const getColorScheme = () => {
    switch (type) {
      case 'balance':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'savings':
        return { bg: '#E3F2FD', text: '#1976D2' };
      case 'monthly':
        return { bg: '#F3E5F5', text: '#7B1FA2' };
      case 'debt':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#F5F5F5', text: '#212121' };
    }
  };

  const colors = getColorScheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.bg }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>
        ${amount.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MetricCard;