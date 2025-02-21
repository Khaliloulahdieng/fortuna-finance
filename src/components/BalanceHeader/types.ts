export interface MetricCardProps {
  title: string;
  amount: number;
  type: "balance" | "savings" | "monthly" | "debt";
}

export interface BalanceHeaderProps {
  currentBalance: number;
  savings: number;
  monthlySavings: number;
  debts: number;
  onUpdateMetric: (type: string) => void;
}