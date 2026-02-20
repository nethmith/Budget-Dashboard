"use client"

import { Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFilterStore } from "@/store/useFilterStore"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

const CATEGORIES = [
    "food",
    "transport",
    "entertainment",
    "salary",
    "utilities",
    "other",
]

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export function TransactionFilters() {
    const {
        search,
        type,
        categories,
        dateRange,
        setSearch,
        setType,
        setCategories,
        setDateRange,
        resetFilters
    } = useFilterStore()

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

    const toggleCategory = (category: string) => {
        if (categories.includes(category)) {
            setCategories(categories.filter((c) => c !== category))
        } else {
            setCategories([...categories, category])
        }
    }

    const hasActiveFilters = search || type !== "all" || categories.length > 0 || dateRange

    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search note or amount..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>

                {/* Type Filter */}
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger className="w-[130px] bg-background">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>

                {/* Category Multi-select */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-background gap-2 min-w-[140px] justify-between">
                            <span className="truncate">
                                {categories.length === 0
                                    ? "All Categories"
                                    : `${categories.length} selected`}
                            </span>
                            <Filter className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2" align="start">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm px-2 pb-1 border-b">Categories</h4>
                            {CATEGORIES.map((cat) => (
                                <div key={cat} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors" onClick={() => toggleCategory(cat)}>
                                    <Checkbox
                                        checked={categories.includes(cat)}
                                        onCheckedChange={() => toggleCategory(cat)}
                                    />
                                    <label className="text-sm capitalize cursor-pointer flex-1">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Month Picker */}
                <div className="flex items-center gap-2">
                    <Select
                        value={dateRange?.month.toString() || "all"}
                        onValueChange={(v) => {
                            if (v === "all") {
                                setDateRange(null)
                            } else {
                                setDateRange({ month: parseInt(v), year: dateRange?.year || currentYear })
                            }
                        }}
                    >
                        <SelectTrigger className="w-[130px] bg-background">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Every Month</SelectItem>
                            {MONTHS.map((m, i) => (
                                <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {dateRange && (
                        <Select
                            value={dateRange.year.toString()}
                            onValueChange={(v) => setDateRange({ ...dateRange, year: parseInt(v) })}
                        >
                            <SelectTrigger className="w-[100px] bg-background">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Reset */}
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground gap-2">
                        <X className="h-4 w-4" /> Clear
                    </Button>
                )}
            </div>

            {/* Active Filter Badges */}
            <div className="flex flex-wrap gap-2">
                {type !== "all" && (
                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                        Type: {type}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setType("all")} />
                    </Badge>
                )}
                {categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="gap-1 px-2 py-1">
                        {cat}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                    </Badge>
                ))}
                {dateRange && (
                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                        {MONTHS[dateRange.month]} {dateRange.year}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRange(null)} />
                    </Badge>
                )}
            </div>
        </div>
    )
}
