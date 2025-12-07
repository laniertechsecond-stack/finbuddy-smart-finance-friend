import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plane, 
  Laptop, 
  Car, 
  GraduationCap,
  ShieldCheck,
  Gift,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SetGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const goalTypes = [
  { id: "vacation", name: "Vacation", icon: Plane, color: "bg-finbud-blue-light text-primary" },
  { id: "tech", name: "Tech", icon: Laptop, color: "bg-finbud-purple-light text-finbud-purple" },
  { id: "car", name: "Car", icon: Car, color: "bg-finbud-green-light text-finbud-green" },
  { id: "education", name: "Education", icon: GraduationCap, color: "bg-finbud-gold-light text-finbud-gold" },
  { id: "emergency", name: "Emergency", icon: ShieldCheck, color: "bg-finbud-coral-light text-finbud-coral" },
  { id: "gift", name: "Gift", icon: Gift, color: "bg-finbud-purple-light text-finbud-purple" },
];

export function SetGoalModal({ open, onOpenChange }: SetGoalModalProps) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = () => {
    if (!goalName || !targetAmount || !selectedType) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success(`Goal "${goalName}" created!`, {
      description: `Target: $${targetAmount}`,
      icon: <Sparkles className="w-4 h-4 text-finbud-gold" />
    });
    
    setGoalName("");
    setTargetAmount("");
    setSelectedType("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Savings Goal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Goal Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">What are you saving for?</Label>
            <div className="grid grid-cols-3 gap-2">
              {goalTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary-foreground/20" : type.color
                    )}>
                      <Icon className={cn("w-6 h-6", isSelected && "text-primary-foreground")} />
                    </div>
                    <span className="text-xs font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Name Input */}
          <div className="space-y-2">
            <Label htmlFor="goalName" className="text-sm text-muted-foreground">Goal Name</Label>
            <Input
              id="goalName"
              placeholder="e.g., Spring Break Trip"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="h-12 rounded-2xl border-2 focus:border-primary"
            />
          </div>
          
          {/* Target Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-sm text-muted-foreground">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">$</span>
              <Input
                id="targetAmount"
                type="number"
                placeholder="500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-10 text-2xl font-bold h-14 rounded-2xl border-2 focus:border-primary"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full h-12 rounded-2xl"
            variant="success"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
