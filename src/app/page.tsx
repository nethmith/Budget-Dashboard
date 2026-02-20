"use client"

import { useMemo, useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionList, TransactionListSkeleton } from '@/components/transactions/TransactionList';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { useTransactionStore } from '@/store/useStore';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { isSameMonth } from 'date-fns';

export default function DashboardPage() {
  const { transactions: allTransactions } = useTransactionStore();
  const transactions = useFilteredTransactions();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;

    const savingsRate = income > 0
      ? ((income - expenses) / income) * 100
      : 0;

    return {
      balance,
      income,
      expenses,
      savingsRate
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const statCards = [
    {
      title: "Current Balance",
      value: formatCurrency(stats.balance),
      icon: Wallet,
      color: "text-primary",
      description: "Based on active filters"
    },
    {
      title: "Focus Income",
      value: formatCurrency(stats.income),
      icon: TrendingUp,
      color: "text-emerald-500",
      description: "Total filtered income"
    },
    {
      title: "Focus Expenses",
      value: formatCurrency(stats.expenses),
      icon: TrendingDown,
      color: "text-rose-500",
      description: "Total filtered expenses"
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: "text-blue-500",
      description: "Income/Expense ratio"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <TransactionFormDialog />
      </div>

      <TransactionFilters />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="content">
              {isLoading ? (
                <Skeleton className="h-8 w-24 mb-1" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          {isLoading ? (
            <div className="rounded-xl border bg-card p-6 h-[350px]">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <MonthlyTrendChart />
          )}
        </div>
        <div className="col-span-3">
          {isLoading ? (
            <div className="rounded-xl border bg-card p-6 h-[350px]">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <CategoryPieChart />
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Transactions</h3>
        {isLoading ? <TransactionListSkeleton /> : <TransactionList />}
      </div>
    </div>
  );
}
