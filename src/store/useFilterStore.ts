import { create } from 'zustand';

export interface FilterState {
    search: string;
    type: 'all' | 'income' | 'expense';
    categories: string[];
    dateRange: {
        month: number; // 0-11
        year: number;
    } | null;
    setSearch: (search: string) => void;
    setType: (type: 'all' | 'income' | 'expense') => void;
    setCategories: (categories: string[]) => void;
    setDateRange: (range: { month: number; year: number } | null) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    search: '',
    type: 'all',
    categories: [],
    dateRange: null,
    setSearch: (search) => set({ search }),
    setType: (type) => set({ type }),
    setCategories: (categories) => set({ categories }),
    setDateRange: (dateRange) => set({ dateRange }),
    resetFilters: () => set({ search: '', type: 'all', categories: [], dateRange: null }),
}));
