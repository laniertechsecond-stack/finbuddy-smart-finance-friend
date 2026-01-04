import { Plus, Target } from "lucide-react";

interface QuickActionsProps {
  onAddExpense: () => void;
  onSetGoal: () => void;
}

export function QuickActions({ onAddExpense, onSetGoal }: QuickActionsProps) {
  const actions = [
    { 
      icon: Plus, 
      label: "Add Expense", 
      onClick: onAddExpense,
      className: "bg-primary text-primary-foreground" 
    },
    { 
      icon: Target, 
      label: "Set Goal", 
      onClick: onSetGoal,
      className: "bg-finbud-green text-primary-foreground" 
    },
  ];
  
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${action.className} flex items-center justify-center shadow-finbud transition-all duration-200 group-hover:scale-105 group-hover:shadow-finbud-lg group-active:scale-95`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
