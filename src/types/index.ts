export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    date: string; // ISO string
    note?: string;
}

export interface TransactionStore {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (id: string, updatedTransaction: Transaction) => void;
}
