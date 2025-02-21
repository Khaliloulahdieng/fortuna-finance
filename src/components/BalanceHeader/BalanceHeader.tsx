// src/components/BalanceHeader/BalanceHeader.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BalanceHeaderProps } from './types';
import MetricCard from './MetricCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const AUTO_SCROLL_INTERVAL = 3000;

const BalanceHeader: React.FC<BalanceHeaderProps> = ({
  currentBalance,
  savings,
  monthlySavings,
  debts,
  onUpdateMetric
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const metrics = [
    [
      { title: 'Current Balance', amount: currentBalance, type: 'balance' },
      { title: 'Savings', amount: savings, type: 'savings' }
    ],
    [
      { title: 'Monthly Savings', amount: monthlySavings, type: 'monthly' },
      { title: 'Debts', amount: debts, type: 'debt' }
    ]
  ];

  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        const nextPage = currentPage === 0 ? 1 : 0;
        setCurrentPage(nextPage);
        scrollViewRef.current?.scrollTo({
          x: nextPage * SCREEN_WIDTH,
          animated: true
        });
      }, AUTO_SCROLL_INTERVAL);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {metrics.map((page, pageIndex) => (
          <View key={pageIndex} style={styles.page}>
            {page.map((metric) => (
              <TouchableOpacity
                key={metric.type}
                style={styles.cardWrapper}
                onPress={() => onUpdateMetric(metric.type)}
              >
                <MetricCard
                  title={metric.title}
                  amount={metric.amount}
                  type={metric.type}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  page: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    position: 'relative',
  }
});

export default BalanceHeader;