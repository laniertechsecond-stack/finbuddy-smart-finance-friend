import { useState } from "react";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingCategories } from "@/components/dashboard/SpendingCategories";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SetGoalModal } from "@/components/modals/SetGoalModal";

export function HomeView() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSetGoal, setShowSetGoal] = useState(false);

  return (
    <div className="space-y-6 pb-24">
      <BudgetOverview 
        totalBudget={2000}
        spent={1310}
        remaining={690}
        percentUsed={65.5}
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
      />
      
      <SetGoalModal 
        open={showSetGoal} 
        onOpenChange={setShowSetGoal} 
      />
    </div>
  );
}
