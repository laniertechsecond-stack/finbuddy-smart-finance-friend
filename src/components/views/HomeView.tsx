import { useState } from "react";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingCategories } from "@/components/dashboard/SpendingCategories";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SetGoalModal } from "@/components/modals/SetGoalModal";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { useBudget } from "@/hooks/useBudget";
import { useLearning } from "@/hooks/useLearning";
import { useProfile } from "@/hooks/useProfile";

interface HomeViewProps {
  onNavigateToLearn?: () => void;
  onNavigateToGoals?: () => void;
  onNavigateToSettings?: (page?: string) => void;
}

export function HomeView({ onNavigateToLearn, onNavigateToGoals, onNavigateToSettings }: HomeViewProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { totalBudget, totalSpent, remaining, loading, addTransaction, categories } = useBudget();
  const { totalCompletedLessons, totalLessons, getNextLesson } = useLearning();
  const { profile } = useProfile();

  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const nextLesson = getNextLesson();

  return (
    <div className="space-y-6 pb-24">
      <BudgetOverview 
        totalBudget={totalBudget}
        spent={totalSpent}
        remaining={remaining}
        percentUsed={percentUsed}
      />
      
      <QuickActions 
        onAddExpense={() => setShowAddExpense(true)}
        onSetGoal={() => setShowSetGoal(true)}
        onViewCards={() => onNavigateToSettings?.('payment')}
        onSavings={onNavigateToGoals}
      />
      
      <LearningProgress 
        completedLessons={totalCompletedLessons}
        totalLessons={totalLessons}
        currentStreak={profile?.current_streak || 0}
        nextLesson={nextLesson?.lesson.title || "All lessons complete!"}
        onStartLesson={onNavigateToLearn || (() => {})}
      />
      
      <SpendingCategories onAddCategory={() => setShowAddCategory(true)} />
      
      <RecentTransactions />

      <AddExpenseModal 
        open={showAddExpense} 
        onOpenChange={setShowAddExpense}
        categories={categories}
        onAddTransaction={addTransaction}
      />
      
      <SetGoalModal 
        open={showSetGoal} 
        onOpenChange={setShowSetGoal} 
      />

      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
      />
    </div>
  );
}
