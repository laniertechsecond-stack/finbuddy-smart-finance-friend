import { 
  Coffee, 
  ShoppingCart, 
  Bus, 
  Gamepad2,
  Pizza,
  ArrowUpRight,
  ArrowDownLeft,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  Smartphone,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBudget } from "@/hooks/useBudget";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const iconMap: Record<string, typeof Coffee> = {
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

function formatTransactionDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export function RecentTransactions() {
  const { transactions, categories, loading } = useBudget();

  const getCategoryInfo = (categoryId: string | null) => {
    if (!categoryId) return { name: 'Uncategorized', icon: MoreHorizontal };
    const cat = categories.find(c => c.id === categoryId);
    return {
      name: cat?.name || 'Uncategorized',
      icon: iconMap[cat?.icon || ''] || MoreHorizontal
    };
  };

  if (loading) {
    return (
      <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
        </div>
        <div className="bg-card rounded-3xl shadow-finbud overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 border-b border-border last:border-0">
              <div className="w-11 h-11 rounded-xl bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
        </div>
        <div className="bg-card rounded-3xl shadow-finbud p-8 text-center">
          <p className="text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add an expense to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="bg-card rounded-3xl shadow-finbud overflow-hidden">
        {transactions.slice(0, 5).map((transaction, index) => {
          const { name: categoryName, icon: Icon } = getCategoryInfo(transaction.category_id);
          const isIncome = transaction.type === 'income';
          
          return (
            <div 
              key={transaction.id}
              className={cn(
                "flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                index !== Math.min(transactions.length, 5) - 1 && "border-b border-border"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                isIncome ? "bg-finbud-green-light" : "bg-muted"
              )}>
                {isIncome ? (
                  <ArrowDownLeft className="w-5 h-5 text-finbud-green" />
                ) : (
                  <Icon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {transaction.merchant || transaction.description || categoryName}
                </h4>
                <p className="text-sm text-muted-foreground">{categoryName}</p>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  isIncome ? "text-finbud-green" : "text-foreground"
                )}>
                  {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTransactionDate(transaction.transaction_date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
