import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type BudgetCategory = Tables<'budget_categories'>;
type Transaction = Tables<'transactions'>;

export function useBudget() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const [categoriesRes, transactionsRes] = await Promise.all([
      supabase.from('budget_categories').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('transaction_date', { ascending: false }),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (transactionsRes.data) setTransactions(transactionsRes.data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (transaction: Omit<TablesInsert<'transactions'>, 'user_id'>) => {
    if (!user) return { error: new Error('No user') };

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single();

    if (data) {
      setTransactions(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const updateCategory = async (categoryId: string, updates: Partial<BudgetCategory>) => {
    if (!user) return { error: new Error('No user') };

    const { error } = await supabase
      .from('budget_categories')
      .update(updates)
      .eq('id', categoryId)
      .eq('user_id', user.id);

    if (!error) {
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updates } : c));
    }

    return { error };
  };

  const addCategory = async (category: Omit<TablesInsert<'budget_categories'>, 'user_id'>) => {
    if (!user) return { error: new Error('No user') };

    const { data, error } = await supabase
      .from('budget_categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (data) {
      setCategories(prev => [...prev, data]);
    }

    return { data, error };
  };

  // Calculate totals
  const totalBudget = categories.reduce((sum, cat) => sum + Number(cat.budget_amount), 0);
  
  // Get spending per category from transactions this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthlyTransactions = transactions.filter(t => t.transaction_date >= monthStart && t.type === 'expense');
  const totalSpent = monthlyTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    categories,
    transactions,
    loading,
    addTransaction,
    updateCategory,
    addCategory,
    refetch: fetchData,
    totalBudget,
    totalSpent,
    remaining: totalBudget - totalSpent,
  };
}
