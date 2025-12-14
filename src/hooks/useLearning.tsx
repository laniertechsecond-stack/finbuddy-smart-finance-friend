import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import type { Tables } from '@/integrations/supabase/types';

type LearningProgress = Tables<'learning_progress'>;

interface LessonContent {
  id: string;
  module_id: string;
  title: string;
  content: string;
  quiz_question: string | null;
  quiz_options: string[] | null;
  quiz_answer: number | null;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

const modules: Module[] = [
  { id: 'budgeting', title: 'Budgeting Basics', description: 'Master the fundamentals of money management', icon: 'wallet', color: 'text-finbud-blue', bgColor: 'bg-finbud-blue-light' },
  { id: 'credit', title: 'Credit Score 101', description: 'Build and maintain good credit', icon: 'credit-card', color: 'text-finbud-purple', bgColor: 'bg-finbud-purple-light' },
  { id: 'saving', title: 'Saving Strategies', description: 'Grow your money over time', icon: 'piggy-bank', color: 'text-finbud-green', bgColor: 'bg-finbud-green-light' },
  { id: 'investing', title: 'Investing 101', description: 'Start your investment journey', icon: 'trending-up', color: 'text-finbud-gold', bgColor: 'bg-finbud-gold-light' },
];

export function useLearning() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [lessonContent, setLessonContent] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch lesson content (public)
      const { data: lessons } = await supabase
        .from('lesson_content')
        .select('*')
        .order('order_index');

      if (lessons) {
        // Parse quiz_options from JSONB
        setLessonContent(lessons.map(l => ({
          ...l,
          quiz_options: l.quiz_options ? JSON.parse(JSON.stringify(l.quiz_options)) : null
        })));
      }

      if (!user) {
        setProgress([]);
        setLoading(false);
        return;
      }

      // Fetch user progress
      const { data: userProgress } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id);

      if (userProgress) setProgress(userProgress);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const completeLesson = async (lessonId: string, moduleId: string, points: number) => {
    if (!user) return { error: new Error('No user') };

    // Check if already completed
    const existing = progress.find(p => p.lesson_id === lessonId);
    if (existing?.completed) return { data: existing, error: null };

    const { data, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
        points_earned: points,
      }, { onConflict: 'id' })
      .select()
      .single();

    if (data) {
      setProgress(prev => {
        const filtered = prev.filter(p => p.lesson_id !== lessonId);
        return [...filtered, data];
      });

      // Update profile XP and points
      if (profile) {
        const newXP = (profile.current_xp || 0) + points;
        const newPoints = (profile.total_points || 0) + points;
        await updateProfile({ 
          current_xp: newXP, 
          total_points: newPoints 
        });
      }
    }

    return { data, error };
  };

  const getModuleProgress = (moduleId: string) => {
    const moduleLessons = lessonContent.filter(l => l.module_id === moduleId);
    const completedLessons = progress.filter(
      p => p.module_id === moduleId && p.completed
    ).length;
    return {
      completed: completedLessons,
      total: moduleLessons.length,
      percentage: moduleLessons.length > 0 
        ? Math.round((completedLessons / moduleLessons.length) * 100) 
        : 0
    };
  };

  const getNextLesson = () => {
    for (const module of modules) {
      const moduleLessons = lessonContent
        .filter(l => l.module_id === module.id)
        .sort((a, b) => a.order_index - b.order_index);
      
      for (const lesson of moduleLessons) {
        const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed);
        if (!isCompleted) {
          return { lesson, module };
        }
      }
    }
    return null;
  };

  const isLessonLocked = (lessonId: string, moduleId: string) => {
    const moduleLessons = lessonContent
      .filter(l => l.module_id === moduleId)
      .sort((a, b) => a.order_index - b.order_index);
    
    const lessonIndex = moduleLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === 0) return false;
    
    // Check if previous lesson is completed
    const prevLesson = moduleLessons[lessonIndex - 1];
    return !progress.some(p => p.lesson_id === prevLesson.id && p.completed);
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const totalCompletedLessons = progress.filter(p => p.completed).length;
  const totalLessons = lessonContent.length;
  const totalPoints = progress.reduce((sum, p) => sum + (p.points_earned || 0), 0);

  return {
    modules,
    lessonContent,
    progress,
    loading,
    completeLesson,
    getModuleProgress,
    getNextLesson,
    isLessonLocked,
    isLessonCompleted,
    totalCompletedLessons,
    totalLessons,
    totalPoints,
  };
}
