export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    date: string; // ISO string
    note?: string;
    recurring?: boolean;
}

export interface TransactionStore {
    transactions: Transaction[];
    budgetGoals: Record<string, number>; // Category name -> monthly limit
    addTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (id: string, updatedTransaction: Transaction) => void;
    setBudgetGoal: (category: string, amount: number) => void;
}
