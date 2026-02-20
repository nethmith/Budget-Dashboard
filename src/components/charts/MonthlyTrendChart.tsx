"use client"

import { useMemo, useState } from "react"
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

export function MonthlyTrendChart() {
    const transactions = useFilteredTransactions()
    const [chartType, setChartType] = useState<"bar" | "line">("bar")

    const data = useMemo(() => {
        const months = []
        const now = new Date()

        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const monthDate = subMonths(now, i)
            const monthStart = startOfMonth(monthDate)
            const monthEnd = endOfMonth(monthDate)
            const monthLabel = format(monthDate, "MMM yy")

            const monthTransactions = transactions.filter((t) =>
                isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
            )

            const income = monthTransactions
                .filter((t) => t.type === "income")
                .reduce((acc, t) => acc + t.amount, 0)

            const expense = monthTransactions
                .filter((t) => t.type === "expense")
                .reduce((acc, t) => acc + t.amount, 0)

            months.push({
                name: monthLabel,
                income,
                expense,
            })
        }
        return months
    }, [transactions])

    const formatYAxis = (value: number) => {
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
        return value.toString()
    }

    return (
        <Card className="flex flex-col h-full bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                    <CardTitle>Cash Flow Trend</CardTitle>
                    <CardDescription>Income vs Expenses over the last 6 months</CardDescription>
                </div>
                <Tabs value={chartType} onValueChange={(v) => setChartType(v as "bar" | "line")}>
                    <TabsList className="grid w-[120px] grid-cols-2">
                        <TabsTrigger value="bar">Bar</TabsTrigger>
                        <TabsTrigger value="line">Line</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "bar" ? (
                            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: 'hsl(var(--card-foreground))'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                                    labelStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                                    formatter={(value: any) =>
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "LKR",
                                        }).format(Number(value))
                                    }
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} name="Income" />
                                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} name="Expense" />
                            </BarChart>
                        ) : (
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: 'hsl(var(--card-foreground))'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                                    labelStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                                    formatter={(value: any) =>
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "LKR",
                                        }).format(Number(value))
                                    }
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Income"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#f43f5e"
                                    strokeWidth={2}
                                    dot={{ fill: '#f43f5e', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Expense"
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
