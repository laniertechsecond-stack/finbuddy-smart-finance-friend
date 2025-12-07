import { 
  Coffee, 
  ShoppingCart, 
  Bus, 
  Gamepad2,
  Pizza,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  icon: typeof Coffee;
}

const transactions: Transaction[] = [
  { id: "1", name: "Starbucks", category: "Food", amount: 5.45, type: "expense", date: "Today", icon: Coffee },
  { id: "2", name: "Scholarship", category: "Income", amount: 500, type: "income", date: "Today", icon: ArrowDownLeft },
  { id: "3", name: "Walmart", category: "Shopping", amount: 42.30, type: "expense", date: "Yesterday", icon: ShoppingCart },
  { id: "4", name: "Bus Pass", category: "Transport", amount: 25, type: "expense", date: "Yesterday", icon: Bus },
  { id: "5", name: "Steam Games", category: "Entertainment", amount: 15.99, type: "expense", date: "Oct 15", icon: Gamepad2 },
];

export function RecentTransactions() {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="bg-card rounded-3xl shadow-finbud overflow-hidden">
        {transactions.map((transaction, index) => {
          const Icon = transaction.icon;
          const isIncome = transaction.type === "income";
          
          return (
            <div 
              key={transaction.id}
              className={cn(
                "flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                index !== transactions.length - 1 && "border-b border-border"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                isIncome ? "bg-finbud-green-light" : "bg-muted"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  isIncome ? "text-finbud-green" : "text-muted-foreground"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{transaction.name}</h4>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  isIncome ? "text-finbud-green" : "text-foreground"
                )}>
                  {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
