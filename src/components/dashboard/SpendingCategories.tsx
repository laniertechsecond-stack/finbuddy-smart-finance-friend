import { 
  Utensils, 
  Home, 
  Car, 
  ShoppingBag, 
  Film, 
  Smartphone,
  GraduationCap,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBudget } from "@/hooks/useBudget";
import { Button } from "@/components/ui/button";

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
  'graduation-cap': GraduationCap,
  education: GraduationCap,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  coral: { text: 'text-finbud-coral', bg: 'bg-finbud-coral-light' },
  blue: { text: 'text-finbud-blue', bg: 'bg-finbud-blue-light' },
  green: { text: 'text-finbud-green', bg: 'bg-finbud-green-light' },
  purple: { text: 'text-finbud-purple', bg: 'bg-finbud-purple-light' },
  gold: { text: 'text-finbud-gold', bg: 'bg-finbud-gold-light' },
};

interface SpendingCategoriesProps {
  onAddCategory?: () => void;
}

export function SpendingCategories({ onAddCategory }: SpendingCategoriesProps) {
  const { categories, transactions, loading } = useBudget();

  // Calculate spending per category from transactions this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthlyExpenses = transactions.filter(
    t => t.transaction_date >= monthStart.split('T')[0] && t.type === 'expense'
  );

  const categorySpending = categories.map(cat => {
    const spent = monthlyExpenses
      .filter(t => t.category_id === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, spent };
  });

  if (loading) {
    return (
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-muted-foreground">Spending by Category</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-2 bg-muted rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-muted-foreground">Spending by Category</h3>
          {onAddCategory && (
            <Button variant="ghost" size="sm" onClick={onAddCategory}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
        <div className="bg-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">No budget categories yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add expenses to see your spending</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-muted-foreground">Spending by Category</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          See All
        </button>
      </div>
      
      <div className="space-y-3">
        {categorySpending.map((category) => {
          const Icon = iconMap[category.icon] || MoreHorizontal;
          const colors = colorMap[category.color] || colorMap.blue;
          const percentUsed = category.budget_amount > 0 
            ? (category.spent / category.budget_amount) * 100 
            : 0;
          const isOverBudget = percentUsed > 100;
          const isWarning = percentUsed > 80 && percentUsed <= 100;
          
          return (
            <div 
              key={category.id}
              className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-finbud transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
                  <Icon className={cn("w-6 h-6", colors.text)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground truncate">{category.name}</h4>
                    <span className={cn(
                      "font-semibold",
                      isOverBudget ? "text-destructive" : "text-foreground"
                    )}>
                      ${category.spent.toFixed(0)}
                      {isOverBudget && (
                        <span className="text-xs text-destructive ml-1">
                          (+${(category.spent - category.budget_amount).toFixed(0)})
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      ${category.budget_amount}
                    </span>
                  </div>
                  
                  {isOverBudget && (
                    <p className="text-xs text-destructive mt-1">
                      Over budget by ${(category.spent - category.budget_amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
