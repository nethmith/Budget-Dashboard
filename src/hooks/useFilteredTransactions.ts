import { useMemo } from 'react';
import { useTransactionStore } from '@/store/useStore';
import { useFilterStore } from '@/store/useFilterStore';
import { isSameMonth, isSameYear } from 'date-fns';

export function useFilteredTransactions() {
    const { transactions } = useTransactionStore();
    const { search, type, categories, dateRange } = useFilterStore();

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            // Search filter (note or amount)
            if (search) {
                const query = search.toLowerCase();
                const matchesNote = t.note?.toLowerCase().includes(query);
                const matchesAmount = t.amount.toString().includes(query);
                const matchesCategory = t.category.toLowerCase().includes(query);
                if (!matchesNote && !matchesAmount && !matchesCategory) return false;
            }

            // Type filter
            if (type !== 'all' && t.type !== type) return false;

            // Category filter
            if (categories.length > 0 && !categories.includes(t.category)) return false;

            // Date Range filter (Month/Year)
            if (dateRange) {
                const date = new Date(t.date);
                const matchesMonth = date.getMonth() === dateRange.month;
                const matchesYear = date.getFullYear() === dateRange.year;
                if (!matchesMonth || !matchesYear) return false;
            }

            return true;
        });
    }, [transactions, search, type, categories, dateRange]);

    return filteredTransactions;
}
