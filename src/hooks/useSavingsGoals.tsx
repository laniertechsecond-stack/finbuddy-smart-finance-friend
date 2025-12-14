import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type SavingsGoal = Tables<'savings_goals'>;

export function useSavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setGoals(data);
      setLoading(false);
    };

    fetchGoals();
  }, [user]);

  const addGoal = async (goal: Omit<TablesInsert<'savings_goals'>, 'user_id'>) => {
    if (!user) return { error: new Error('No user') };

    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();

    if (data) {
      setGoals([data, ...goals]);
    }

    return { data, error };
  };

  const updateGoal = async (goalId: string, updates: Partial<SavingsGoal>) => {
    if (!user) return { error: new Error('No user') };

    const { error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', goalId)
      .eq('user_id', user.id);

    if (!error) {
      setGoals(goals.map(g => g.id === goalId ? { ...g, ...updates } : g));
    }

    return { error };
  };

  return { goals, loading, addGoal, updateGoal };
}
