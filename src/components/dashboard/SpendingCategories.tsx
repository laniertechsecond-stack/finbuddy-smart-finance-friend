import { 
  Utensils, 
  Home, 
  Car, 
  ShoppingBag, 
  Film, 
  Smartphone,
  GraduationCap,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  spent: number;
  budget: number;
  icon: typeof Utensils;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  { id: "food", name: "Food & Dining", spent: 245, budget: 400, icon: Utensils, color: "text-finbud-coral", bgColor: "bg-finbud-coral-light" },
  { id: "rent", name: "Rent", spent: 800, budget: 800, icon: Home, color: "text-finbud-blue", bgColor: "bg-finbud-blue-light" },
  { id: "transport", name: "Transport", spent: 65, budget: 150, icon: Car, color: "text-finbud-green", bgColor: "bg-finbud-green-light" },
  { id: "shopping", name: "Shopping", spent: 120, budget: 200, icon: ShoppingBag, color: "text-finbud-purple", bgColor: "bg-finbud-purple-light" },
  { id: "entertainment", name: "Entertainment", spent: 45, budget: 100, icon: Film, color: "text-finbud-gold", bgColor: "bg-finbud-gold-light" },
  { id: "subscriptions", name: "Subscriptions", spent: 35, budget: 50, icon: Smartphone, color: "text-primary", bgColor: "bg-finbud-blue-light" },
];

export function SpendingCategories() {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-muted-foreground">Spending by Category</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          See All
        </button>
      </div>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const percentUsed = (category.spent / category.budget) * 100;
          const isOverBudget = percentUsed > 100;
          const isWarning = percentUsed > 80;
          
          return (
            <div 
              key={category.id}
              className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-finbud transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", category.bgColor)}>
                  <Icon className={cn("w-6 h-6", category.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground truncate">{category.name}</h4>
                    <span className={cn(
                      "font-semibold",
                      isOverBudget ? "text-destructive" : "text-foreground"
                    )}>
                      ${category.spent}
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
                      ${category.budget}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
