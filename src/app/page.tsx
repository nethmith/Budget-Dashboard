"use client"

import { useMemo, useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionList } from '@/components/transactions/TransactionList';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { useTransactionStore } from '@/store/useStore';
import { isSameMonth } from 'date-fns';

export default function DashboardPage() {
  const { transactions } = useTransactionStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();

    // Total Balance = All Time Income - All Time Expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // This Month's Income & Expenses
    const thisMonthTransactions = transactions.filter(t =>
      isSameMonth(new Date(t.date), now)
    );

    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    // Savings Rate (This Month)
    const savingsRate = thisMonthIncome > 0
      ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100
      : 0;

    return {
      balance,
      income: thisMonthIncome,
      expenses: thisMonthExpenses,
      savingsRate
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  // Prevent hydration mismatch by showing skeletons or null until mounted
  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  const statCards = [
    {
      title: "Total Balance",
      value: formatCurrency(stats.balance),
      icon: Wallet,
      color: "text-primary",
      description: "All time balance"
    },
    {
      title: "Income (This Month)",
      value: formatCurrency(stats.income),
      icon: TrendingUp,
      color: "text-emerald-500",
      description: "Inflows this month"
    },
    {
      title: "Expenses (This Month)",
      value: formatCurrency(stats.expenses),
      icon: TrendingDown,
      color: "text-rose-500",
      description: "Outflows this month"
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: "text-blue-500",
      description: "Of monthly income"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <TransactionFormDialog />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="content">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <MonthlyTrendChart />
        </div>
        <div className="col-span-3">
          <CategoryPieChart />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Transactions</h3>
        <TransactionList />
      </div>
    </div>
  );
}
