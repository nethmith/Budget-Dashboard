"use client"

import * as React from "react"
import { format } from "date-fns"
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTransactionStore } from "@/store/useStore"
import { Transaction } from "@/types"
import { toast } from "sonner"

export function TransactionList() {
    const { transactions, removeTransaction } = useTransactionStore()

    const handleDelete = (id: string) => {
        // Basic confirmation (Day 6 will be better)
        if (confirm("Are you sure you want to delete this transaction?")) {
            removeTransaction(id)
            toast.success("Transaction deleted")
        }
    }

    // Sort by date desc
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (transactions.length === 0) {
        return (
            <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No transactions found. Add one to get started!
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card">
            <ScrollArea className="h-[400px] w-full">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                        <TableRow>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Note</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {format(new Date(transaction.date), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize">
                                        {transaction.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell max-w-[200px] truncate text-muted-foreground">
                                    {transaction.note || "-"}
                                </TableCell>
                                <TableCell className="text-right font-medium whitespace-nowrap">
                                    <span
                                        className={
                                            transaction.type === "income"
                                                ? "text-emerald-500 flex items-center justify-end gap-1"
                                                : "text-rose-500 flex items-center justify-end gap-1"
                                        }
                                    >
                                        {transaction.type === "income" ? (
                                            <ArrowUpCircle className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownCircle className="h-4 w-4" />
                                        )}
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "LKR", // Changed to LKR as requested in initial prompt
                                        }).format(transaction.amount)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(transaction.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}
