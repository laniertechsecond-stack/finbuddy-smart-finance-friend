import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetOverviewProps {
  totalBudget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export function BudgetOverview({ totalBudget, spent, remaining, percentUsed }: BudgetOverviewProps) {
  const isOverBudget = percentUsed > 100;
  const isWarning = percentUsed > 80 && percentUsed <= 100;
  
  return (
    <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">This Month</h2>
        <span className="text-sm text-muted-foreground">Oct 2024</span>
      </div>
      
      {/* Main Amount Display */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-1">Available to Spend</p>
        <p className={cn(
          "text-4xl font-bold",
          isOverBudget ? "text-destructive" : "text-foreground"
        )}>
          ${remaining.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          of ${totalBudget.toLocaleString()} budget
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isOverBudget 
                ? "bg-destructive" 
                : isWarning 
                  ? "bg-finbud-gold" 
                  : "gradient-hero"
            )}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <p className={cn(
          "text-sm mt-2 text-center font-medium",
          isOverBudget 
            ? "text-destructive" 
            : isWarning 
              ? "text-finbud-gold" 
              : "text-muted-foreground"
        )}>
          {percentUsed.toFixed(0)}% used
        </p>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-finbud-green-light rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-finbud-green" />
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <p className="text-xl font-bold text-finbud-green">
            +${totalBudget.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-finbud-coral-light rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-finbud-coral" />
            <span className="text-sm text-muted-foreground">Spent</span>
          </div>
          <p className="text-xl font-bold text-finbud-coral">
            -${spent.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
