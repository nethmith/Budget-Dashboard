"use client"

import * as React from "react"
import { format } from "date-fns"
import { Trash2, ArrowUpCircle, ArrowDownCircle, Pencil, Utensils, Car, Tv, Banknote, Zap, HelpCircle } from "lucide-react"

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
import { toast } from "sonner"
import { TransactionFormDialog } from "./TransactionFormDialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions"
import { Skeleton } from "@/components/ui/skeleton"

const categoryIcons: Record<string, React.ReactNode> = {
    food: <Utensils className="h-4 w-4" />,
    transport: <Car className="h-4 w-4" />,
    entertainment: <Tv className="h-4 w-4" />,
    salary: <Banknote className="h-4 w-4" />,
    utilities: <Zap className="h-4 w-4" />,
    other: <HelpCircle className="h-4 w-4" />,
}

export function TransactionList() {
    const { removeTransaction } = useTransactionStore()
    const transactions = useFilteredTransactions()
    const [deleteId, setDeleteId] = React.useState<string | null>(null)

    const handleDelete = () => {
        if (deleteId) {
            removeTransaction(deleteId)
            toast.success("Transaction deleted")
            setDeleteId(null)
        }
    }

    // Sort by date desc
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (transactions.length === 0) {
        return (
            <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No transactions found matching your filters.
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
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {format(new Date(transaction.date), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize flex items-center gap-2 w-fit">
                                        {categoryIcons[transaction.category.toLowerCase()] || categoryIcons.other}
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
                                            currency: "LKR",
                                            minimumFractionDigits: 2,
                                        }).format(transaction.amount)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TransactionFormDialog
                                            transaction={transaction}
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => setDeleteId(transaction.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export function TransactionListSkeleton() {
    return (
        <div className="rounded-md border bg-card/50">
            <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <Skeleton className="h-10 w-[120px]" />
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-[100px]" />
                        <Skeleton className="h-10 w-[100px]" />
                    </div>
                ))}
            </div>
        </div>
    )
}
