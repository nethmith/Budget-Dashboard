import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction, TransactionStore } from '@/types';

export const useTransactionStore = create<TransactionStore>()(
    persist(
        (set) => ({
            transactions: [],
            addTransaction: (transaction: Transaction) =>
                set((state) => ({ transactions: [transaction, ...state.transactions] })),
            removeTransaction: (id: string) =>
                set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),
            editTransaction: (id: string, updatedTransaction: Transaction) =>
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? updatedTransaction : t
                    ),
                })),
        }),
        {
            name: 'finance-tracker-store', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
