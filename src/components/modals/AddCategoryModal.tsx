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
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Smartphone,
  Home,
  GraduationCap,
  Dumbbell,
  Heart,
  Plane,
  Gift,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBudget } from "@/hooks/useBudget";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const icons = [
  { id: 'utensils', icon: Utensils, label: 'Food' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'car', icon: Car, label: 'Transport' },
  { id: 'shopping-bag', icon: ShoppingBag, label: 'Shopping' },
  { id: 'film', icon: Film, label: 'Entertainment' },
  { id: 'smartphone', icon: Smartphone, label: 'Tech' },
  { id: 'graduation-cap', icon: GraduationCap, label: 'Education' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Fitness' },
  { id: 'heart', icon: Heart, label: 'Health' },
  { id: 'plane', icon: Plane, label: 'Travel' },
  { id: 'gift', icon: Gift, label: 'Gifts' },
  { id: 'coffee', icon: Coffee, label: 'Coffee' },
];

const colors = [
  { id: 'coral', className: 'bg-finbud-coral' },
  { id: 'blue', className: 'bg-finbud-blue' },
  { id: 'green', className: 'bg-finbud-green' },
  { id: 'purple', className: 'bg-finbud-purple' },
  { id: 'gold', className: 'bg-finbud-gold' },
];

export function AddCategoryModal({ open, onOpenChange }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("utensils");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCategory } = useBudget();

  const handleSubmit = async () => {
    if (!name || !budgetAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const { error } = await addCategory({
      name,
      budget_amount: parseFloat(budgetAmount),
      icon: selectedIcon,
      color: selectedColor,
    });

    if (error) {
      toast.error("Failed to create category");
      setIsSubmitting(false);
      return;
    }

    toast.success(`Category "${name}" created!`);
    setName("");
    setBudgetAmount("");
    setSelectedIcon("utensils");
    setSelectedColor("blue");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Budget Category</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-muted-foreground">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-2xl border-2 focus:border-primary"
            />
          </div>

          {/* Budget Amount */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm text-muted-foreground">Monthly Budget</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">$</span>
              <Input
                id="budget"
                type="number"
                placeholder="200"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="pl-10 text-2xl font-bold h-14 rounded-2xl border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIcon(item.id)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center transition-all",
                      isSelected 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all",
                    color.className,
                    selectedColor === color.id && "ring-2 ring-offset-2 ring-foreground"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full h-12 rounded-2xl"
            variant="hero"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
