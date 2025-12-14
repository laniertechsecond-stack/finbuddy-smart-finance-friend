import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlock_criteria: string;
  category: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      // Fetch all badge definitions
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*');

      if (allBadges) setBadges(allBadges);

      if (!user) {
        setUserBadges([]);
        setLoading(false);
        return;
      }

      // Fetch user's earned badges
      const { data: earned } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (earned) setUserBadges(earned);
      setLoading(false);
    };

    fetchBadges();

    if (user) {
      // Subscribe to badge updates
      const channel = supabase
        .channel('user-badges-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_badges',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setUserBadges(prev => [...prev, payload.new as UserBadge]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const earnBadge = async (badgeId: string) => {
    if (!user) return { error: new Error('No user') };

    // Check if already earned
    const alreadyEarned = userBadges.some(ub => ub.badge_id === badgeId);
    if (alreadyEarned) return { data: null, error: null };

    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: user.id,
        badge_id: badgeId,
      })
      .select()
      .single();

    if (data) {
      setUserBadges(prev => [...prev, data]);
    }

    return { data, error };
  };

  const hasBadge = (badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  const getBadgeWithStatus = () => {
    return badges.map(badge => ({
      ...badge,
      earned: userBadges.some(ub => ub.badge_id === badge.id),
      earnedAt: userBadges.find(ub => ub.badge_id === badge.id)?.earned_at,
    }));
  };

  const earnedCount = userBadges.length;

  return {
    badges,
    userBadges,
    loading,
    earnBadge,
    hasBadge,
    getBadgeWithStatus,
    earnedCount,
  };
}
