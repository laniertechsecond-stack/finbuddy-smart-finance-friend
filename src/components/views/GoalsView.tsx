import { useState } from "react";
import { Target, Plus, Trash2, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { SetGoalModal } from "@/components/modals/SetGoalModal";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function GoalsView() {
  const { goals, loading, updateGoal } = useSavingsGoals();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const handleAddToGoal = async (goalId: string) => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newAmount = (goal.current_amount || 0) + amount;
    const { error } = await updateGoal(goalId, { current_amount: newAmount });

    if (error) {
      toast.error("Failed to update goal");
    } else {
      toast.success(`Added $${amount.toFixed(2)} to ${goal.name}!`);
      if (newAmount >= goal.target_amount) {
        toast.success("🎉 Congratulations! You've reached your goal!");
      }
    }
    setEditingGoal(null);
    setAddAmount("");
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      toast.error("Failed to delete goal");
    } else {
      toast.success("Goal deleted");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Savings Goals</h2>
          <p className="text-muted-foreground">Track your progress toward financial milestones</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 text-center shadow-sm">
          <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">Start saving by creating your first goal!</p>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = goal.target_amount > 0 
              ? ((goal.current_amount || 0) / goal.target_amount) * 100 
              : 0;
            const isComplete = progress >= 100;

            return (
              <div
                key={goal.id}
                className={cn(
                  "bg-card rounded-3xl p-5 shadow-sm transition-all",
                  isComplete && "ring-2 ring-finbud-green"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isComplete ? "bg-finbud-green-light" : "bg-primary/10"
                    )}>
                      {isComplete ? (
                        <Check className="w-6 h-6 text-finbud-green" />
                      ) : (
                        <Target className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setEditingGoal(goal.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      ${(goal.current_amount || 0).toFixed(2)} / ${goal.target_amount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-3" />
                  <p className="text-sm text-muted-foreground text-right">
                    {progress.toFixed(0)}% complete
                  </p>
                </div>

                {!isComplete && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 rounded-xl"
                    onClick={() => setEditingGoal(goal.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Savings
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <SetGoalModal open={showAddGoal} onOpenChange={setShowAddGoal} />

      {/* Add Savings Dialog */}
      <Dialog open={editingGoal !== null} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Savings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Amount to Add</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditingGoal(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => editingGoal && handleAddToGoal(editingGoal)}>
                Add Savings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
