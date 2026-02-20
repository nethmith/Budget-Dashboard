"use client"

import { useMemo } from "react"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog"
import ErrorBoundary from "@/components/common/ErrorBoundary"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, CreditCard, ArrowRightLeft } from "lucide-react"

export default function TransactionsPage() {
    const transactions = useFilteredTransactions()

    const stats = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0)

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0)

        return {
            total: income + expenses,
            income,
            expenses,
            net: income - expenses,
            count: transactions.length
        }
    }, [transactions])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
        }).format(amount)
    }

    return (
        <ErrorBoundary>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Transactions</h1>
                        <p className="text-muted-foreground mt-1">
                            Detailed overview of your financial movement.
                        </p>
                    </div>
                    <TransactionFormDialog />
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Volume", value: formatCurrency(stats.total), icon: ArrowRightLeft, color: "text-primary" },
                        { label: "Net Cashflow", value: formatCurrency(stats.net), icon: CreditCard, color: stats.net >= 0 ? "text-emerald-500" : "text-rose-500" },
                        { label: "Total Income", value: formatCurrency(stats.income), icon: TrendingUp, color: "text-emerald-500" },
                        { label: "Total Expenses", value: formatCurrency(stats.expenses), icon: TrendingDown, color: "text-rose-500" },
                    ].map((s, i) => (
                        <Card key={i} className="bg-card/50 backdrop-blur-sm border-muted">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                                    <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                                </div>
                                <div className={`p-2 rounded-lg bg-muted/50 ${s.color}`}>
                                    <s.icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <TransactionFilters />
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex items-center justify-between border-b pb-2">
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="all" className="px-6">All History</TabsTrigger>
                                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                                <TabsTrigger value="income">Income</TabsTrigger>
                            </TabsList>
                            <span className="text-xs font-mono text-muted-foreground">
                                Showing {stats.count} records
                            </span>
                        </div>

                        <div className="mt-4">
                            <TabsContent value="all" className="mt-0 outline-none">
                                <Card className="border-none shadow-none bg-transparent">
                                    <TransactionList />
                                </Card>
                            </TabsContent>

                            <TabsContent value="expenses" className="mt-0 outline-none">
                                <Card className="border-none shadow-none bg-transparent">
                                    <TransactionList typeFilter="expense" />
                                </Card>
                            </TabsContent>

                            <TabsContent value="income" className="mt-0 outline-none">
                                <Card className="border-none shadow-none bg-transparent">
                                    <TransactionList typeFilter="income" />
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </motion.div>
        </ErrorBoundary>
    )
}
