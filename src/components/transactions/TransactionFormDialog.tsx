"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Plus, Pencil, Utensils, Car, Tv, Banknote, Zap, HelpCircle } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { useTransactionStore } from "@/store/useStore"

const formSchema = z.object({
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category is required"),
    date: z.date(),
    note: z.string().optional(),
    type: z.enum(["income", "expense"]),
    recurring: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormDialogProps {
    transaction?: Transaction // If provided, we are in Edit mode
    trigger?: React.ReactNode // Custom trigger
}

export function TransactionFormDialog({ transaction, trigger }: TransactionFormDialogProps) {
    const [open, setOpen] = useState(false)
    const { addTransaction, editTransaction } = useTransactionStore()
    const isEditMode = !!transaction

    const form = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            amount: transaction?.amount || 0,
            category: transaction?.category || "",
            date: transaction?.date ? new Date(transaction.date) : new Date(),
            note: transaction?.note || "",
            type: transaction?.type || "expense",
            recurring: transaction?.recurring || false,
        },
    })

    // Reset form when transaction prop changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                amount: transaction?.amount || 0,
                category: transaction?.category || "",
                date: transaction?.date ? new Date(transaction.date) : new Date(),
                note: transaction?.note || "",
                type: transaction?.type || "expense",
                recurring: transaction?.recurring || false,
            })
        }
    }, [transaction, open, form])

    function onSubmit(values: FormValues) {
        try {
            if (isEditMode && transaction) {
                editTransaction(transaction.id, {
                    ...transaction,
                    type: values.type,
                    amount: values.amount,
                    category: values.category,
                    date: values.date.toISOString(),
                    note: values.note,
                    recurring: values.recurring,
                })
                toast.success("Transaction updated successfully")
            } else {
                addTransaction({
                    id: uuidv4(),
                    type: values.type,
                    amount: values.amount,
                    category: values.category,
                    date: values.date.toISOString(),
                    note: values.note,
                    recurring: values.recurring,
                })
                toast.success("Transaction added successfully")
            }

            setOpen(false)
            if (!isEditMode) {
                form.reset({
                    amount: 0,
                    category: "",
                    date: new Date(),
                    note: "",
                    type: "expense",
                    recurring: false,
                })
            }
        } catch (error) {
            console.error("Failed to save transaction:", error)
            toast.error("Failed to save transaction")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2" aria-label="Open add transaction dialog">
                        <Plus className="h-4 w-4" /> Add Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Make changes to your transaction details below."
                            : "Add a new income or expense to track your budget."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Type Selection */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Transaction Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="income" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Income
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="expense" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Expense
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Amount */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">LKR</span>
                                            <Input placeholder="0.00" type="number" step="0.01" className="pl-12" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="food">
                                                <div className="flex items-center gap-2">
                                                    <Utensils className="h-4 w-4" />
                                                    <span>Food</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="transport">
                                                <div className="flex items-center gap-2">
                                                    <Car className="h-4 w-4" />
                                                    <span>Transport</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="entertainment">
                                                <div className="flex items-center gap-2">
                                                    <Tv className="h-4 w-4" />
                                                    <span>Entertainment</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="salary">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="h-4 w-4" />
                                                    <span>Salary</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="utilities">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-4 w-4" />
                                                    <span>Utilities</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="other">
                                                <div className="flex items-center gap-2">
                                                    <HelpCircle className="h-4 w-4" />
                                                    <span>Other</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date */}
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Note */}
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add a note..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Recurring */}
                        <FormField
                            control={form.control}
                            name="recurring"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Recurring Monthly
                                        </FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            This transaction repeats every month.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {isEditMode ? "Save Changes" : "Add Transaction"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
