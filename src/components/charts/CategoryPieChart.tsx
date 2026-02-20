"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionStore } from "@/store/useStore"

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8884d8",
]

export function CategoryPieChart() {
    const { transactions } = useTransactionStore()

    const data = useMemo(() => {
        const expenses = transactions.filter((t) => t.type === "expense")
        const categories: Record<string, number> = {}

        expenses.forEach((t) => {
            categories[t.category] = (categories[t.category] || 0) + t.amount
        })

        return Object.entries(categories).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
        }))
    }, [transactions])

    if (data.length === 0) {
        return (
            <Card className="flex flex-col h-full bg-card">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>By Category</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-6 grayscale opacity-50">
                    <div className="text-center text-sm text-muted-foreground">
                        No expenses tracked yet
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-full bg-card">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>By Category</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) =>
                                    new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "LKR",
                                    }).format(Number(value || 0))
                                }
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
