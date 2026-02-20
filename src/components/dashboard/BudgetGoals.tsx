"use client"

import { useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { useTransactionStore } from "@/store/useStore"
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Car, Tv, Zap, HelpCircle } from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
    food: Utensils,
    transport: Car,
    entertainment: Tv,
    utilities: Zap,
    other: HelpCircle,
}

export function BudgetGoals() {
    const { budgetGoals } = useTransactionStore()
    const transactions = useFilteredTransactions()

    const budgetStats = useMemo(() => {
        const spentByCategory: Record<string, number> = {}

        // Use all filtered transactions that are expenses
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const cat = t.category.toLowerCase()
            spentByCategory[cat] = (spentByCategory[cat] || 0) + t.amount
        })

        return Object.entries(budgetGoals).map(([category, limit]) => {
            const spent = spentByCategory[category] || 0
            const progress = Math.min((spent / limit) * 100, 100)
            return {
                category,
                limit,
                spent,
                progress,
                isOverBudget: spent > limit
            }
        })
    }, [transactions, budgetGoals])

    return (
        <Card className="h-full bg-card">
            <CardHeader>
                <CardTitle>Budget Goals</CardTitle>
                <CardDescription>Monthly category limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {budgetStats.map((stat) => {
                    const Icon = categoryIcons[stat.category] || HelpCircle
                    return (
                        <div key={stat.category} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize font-medium">{stat.category}</span>
                                </div>
                                <span className="text-muted-foreground">
                                    LKR {stat.spent.toLocaleString()} / {stat.limit.toLocaleString()}
                                </span>
                            </div>
                            <Progress
                                value={stat.progress}
                                className={`h-2 ${stat.isOverBudget ? "bg-rose-100 dark:bg-rose-900/30" : ""}`}
                                // @ts-ignore - shadcn progress might not support indicator color directly via prop easily depending on version
                                indicatorClassName={stat.isOverBudget ? "bg-rose-500" : "bg-primary"}
                            />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
