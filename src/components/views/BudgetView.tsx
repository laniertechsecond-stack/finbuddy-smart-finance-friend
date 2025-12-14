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
import { useBudget } from "@/hooks/useBudget";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";

const iconMap: Record<string, typeof Utensils> = {
  utensils: Utensils,
  food: Utensils,
  home: Home,
  rent: Home,
  car: Car,
  transport: Car,
  'shopping-bag': ShoppingBag,
  shopping: ShoppingBag,
  film: Film,
  entertainment: Film,
  smartphone: Smartphone,
  subscriptions: Smartphone,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  coral: { text: 'text-finbud-coral', bg: 'bg-finbud-coral-light' },
  blue: { text: 'text-finbud-blue', bg: 'bg-finbud-blue-light' },
  green: { text: 'text-finbud-green', bg: 'bg-finbud-green-light' },
  purple: { text: 'text-finbud-purple', bg: 'bg-finbud-purple-light' },
  gold: { text: 'text-finbud-gold', bg: 'bg-finbud-gold-light' },
};

export function BudgetView() {
  const [period, setPeriod] = useState<"week" | "month" | "semester">("month");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { categories, transactions, loading, totalBudget, totalSpent } = useBudget();
  
  // Calculate spending per category
  const now = new Date();
  let startDate: Date;
  let daysRemaining: number;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      daysRemaining = 7 - now.getDay();
      break;
    case 'semester':
      // Assuming semester is ~4 months
      const semesterMonth = Math.floor(now.getMonth() / 4) * 4;
      startDate = new Date(now.getFullYear(), semesterMonth, 1);
      const semesterEnd = new Date(now.getFullYear(), semesterMonth + 4, 0);
      daysRemaining = Math.ceil((semesterEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      break;
    default: // month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      daysRemaining = monthEnd.getDate() - now.getDate();
  }

  const periodStart = startDate.toISOString().split('T')[0];
  const periodExpenses = transactions.filter(
    t => t.transaction_date >= periodStart && t.type === 'expense'
  );

  const periodSpent = periodExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate budget multiplier for period
  const periodMultiplier = period === 'week' ? 0.25 : period === 'semester' ? 4 : 1;
  const periodBudget = totalBudget * periodMultiplier;
  const remaining = periodBudget - periodSpent;

  const categorySpending = categories.map(cat => {
    const spent = periodExpenses
      .filter(t => t.category_id === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, spent, periodBudget: cat.budget_amount * periodMultiplier };
  });

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <div className="h-12 bg-muted rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded-2xl animate-pulse" />
          <div className="h-24 bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

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
          <p className="text-2xl font-bold text-foreground">${periodBudget.toLocaleString()}</p>
        </div>
        
        <div className="bg-finbud-coral-light rounded-2xl p-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-finbud-coral" />
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${periodSpent.toLocaleString()}</p>
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
        <p className={cn(
          "text-4xl font-bold mb-2",
          remaining < 0 ? "text-destructive" : "text-primary"
        )}>
          ${remaining.toLocaleString()}
        </p>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              periodSpent > periodBudget ? "bg-destructive" : "gradient-hero"
            )}
            style={{ width: `${Math.min((periodSpent / periodBudget) * 100, 100)}%` }}
          />
        </div>
        {periodSpent > periodBudget && (
          <p className="text-sm text-destructive mt-2">
            Over budget by ${(periodSpent - periodBudget).toLocaleString()}!
          </p>
        )}
        {remaining > 0 && daysRemaining > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            ${(remaining / daysRemaining).toFixed(0)} per day for the rest of the {period}
          </p>
        )}
      </div>

      {/* Category Budgets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Category Budgets</h3>
          <Button variant="soft" size="sm" className="rounded-xl" onClick={() => setShowAddCategory(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
        
        {categorySpending.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">No categories yet</p>
            <Button variant="link" onClick={() => setShowAddCategory(true)}>
              Create your first category
            </Button>
          </div>
        ) : (
          categorySpending.map((category, index) => {
            const Icon = iconMap[category.icon] || Utensils;
            const colors = colorMap[category.color] || colorMap.blue;
            const percentUsed = category.periodBudget > 0 
              ? (category.spent / category.periodBudget) * 100 
              : 0;
            const isOverBudget = percentUsed > 100;
            const isWarning = percentUsed > 80;
            
            return (
              <div 
                key={category.id}
                className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-finbud transition-all animate-slide-up cursor-pointer"
                style={{ animationDelay: `${0.1 * (index + 3)}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", colors.bg)}>
                    <Icon className={cn("w-7 h-7", colors.text)} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{category.name}</h4>
                      <div className="text-right">
                        <span className={cn(
                          "font-bold",
                          isOverBudget ? "text-destructive" : "text-foreground"
                        )}>
                          ${category.spent.toFixed(0)}
                        </span>
                        <span className="text-muted-foreground"> / ${category.periodBudget.toFixed(0)}</span>
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
                        ? `$${(category.spent - category.periodBudget).toFixed(0)} over budget` 
                        : `$${(category.periodBudget - category.spent).toFixed(0)} remaining`
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddCategoryModal 
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
      />
    </div>
  );
}
