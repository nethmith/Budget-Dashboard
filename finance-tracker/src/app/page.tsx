import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <AddTransactionDialog />
      </div>

      {/* Stats Grid Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Balance", value: "$4,250.00", icon: Wallet, color: "text-primary" },
          { title: "Income", value: "$4,500.00", icon: TrendingUp, color: "text-emerald-500" },
          { title: "Expenses", value: "$250.00", icon: TrendingDown, color: "text-rose-500" },
          { title: "Savings", value: "+ 20%", icon: PiggyBank, color: "text-blue-500" }
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="content">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Overview</h3>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
            Chart Placeholder
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Transactions</h3>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
            List Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
