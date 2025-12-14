import { useState } from "react";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingCategories } from "@/components/dashboard/SpendingCategories";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SetGoalModal } from "@/components/modals/SetGoalModal";
import { useBudget } from "@/hooks/useBudget";

export function HomeView() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const { totalBudget, totalSpent, remaining, loading, addTransaction, categories } = useBudget();

  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6 pb-24">
      <BudgetOverview 
        totalBudget={totalBudget || 2000}
        spent={totalSpent}
        remaining={remaining || 2000}
        percentUsed={percentUsed}
      />
      
      <QuickActions 
        onAddExpense={() => setShowAddExpense(true)}
        onSetGoal={() => setShowSetGoal(true)}
      />
      
      <LearningProgress 
        completedLessons={8}
        totalLessons={24}
        currentStreak={5}
        nextLesson="Credit Score Basics"
        onStartLesson={() => {}}
      />
      
      <SpendingCategories />
      
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
    </div>
  );
}
