import { useState } from "react";
import { 
  Utensils, 
  Home, 
  Car, 
  ShoppingBag, 
  Film, 
  Smartphone,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  icon: typeof Utensils;
  color: string;
  bgColor: string;
}

const budgetCategories: BudgetCategory[] = [
  { id: "food", name: "Food & Dining", spent: 245, budget: 400, icon: Utensils, color: "text-finbud-coral", bgColor: "bg-finbud-coral-light" },
  { id: "rent", name: "Rent", spent: 800, budget: 800, icon: Home, color: "text-finbud-blue", bgColor: "bg-finbud-blue-light" },
  { id: "transport", name: "Transport", spent: 65, budget: 150, icon: Car, color: "text-finbud-green", bgColor: "bg-finbud-green-light" },
  { id: "shopping", name: "Shopping", spent: 120, budget: 200, icon: ShoppingBag, color: "text-finbud-purple", bgColor: "bg-finbud-purple-light" },
  { id: "entertainment", name: "Entertainment", spent: 45, budget: 100, icon: Film, color: "text-finbud-gold", bgColor: "bg-finbud-gold-light" },
  { id: "subscriptions", name: "Subscriptions", spent: 35, budget: 50, icon: Smartphone, color: "text-primary", bgColor: "bg-finbud-blue-light" },
];

export function BudgetView() {
  const [period, setPeriod] = useState<"week" | "month" | "semester">("month");
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6 pb-24">
      {/* Period Selector */}
      <div className="flex items-center gap-2 bg-muted p-1 rounded-2xl">
        {(["week", "month", "semester"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200",
              period === p 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-finbud-green-light rounded-2xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-finbud-green" />
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</p>
        </div>
        
        <div className="bg-finbud-coral-light rounded-2xl p-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-finbud-coral" />
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Remaining Card */}
      <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Remaining this {period}</span>
          </div>
        </div>
        <p className="text-4xl font-bold text-primary mb-2">${remaining.toLocaleString()}</p>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-hero rounded-full transition-all duration-500"
            style={{ width: `${(totalSpent / totalBudget) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ${((remaining) / 15).toFixed(0)} per day for the rest of the {period}
        </p>
      </div>

      {/* Category Budgets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Category Budgets</h3>
          <Button variant="soft" size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
        
        {budgetCategories.map((category, index) => {
          const Icon = category.icon;
          const percentUsed = (category.spent / category.budget) * 100;
          const isOverBudget = percentUsed > 100;
          const isWarning = percentUsed > 80;
          
          return (
            <div 
              key={category.id}
              className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-finbud transition-all animate-slide-up cursor-pointer"
              style={{ animationDelay: `${0.1 * (index + 3)}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", category.bgColor)}>
                  <Icon className={cn("w-7 h-7", category.color)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{category.name}</h4>
                    <div className="text-right">
                      <span className={cn(
                        "font-bold",
                        isOverBudget ? "text-destructive" : "text-foreground"
                      )}>
                        ${category.spent}
                      </span>
                      <span className="text-muted-foreground"> / ${category.budget}</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isOverBudget 
                          ? "bg-destructive" 
                          : isWarning 
                            ? "bg-finbud-gold" 
                            : "bg-primary"
                      )}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                  
                  <p className={cn(
                    "text-xs mt-1",
                    isOverBudget ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {isOverBudget 
                      ? `$${(category.spent - category.budget)} over budget` 
                      : `$${category.budget - category.spent} remaining`
                    }
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
