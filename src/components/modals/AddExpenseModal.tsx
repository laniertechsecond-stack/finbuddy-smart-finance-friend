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
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Tables<'budget_categories'>[];
  onAddTransaction?: (transaction: Omit<TablesInsert<'transactions'>, 'user_id'>) => Promise<{ error: Error | null }>;
}

const defaultCategories = [
  { id: "food", name: "Food", icon: Utensils, color: "bg-finbud-coral-light text-finbud-coral" },
  { id: "transport", name: "Transport", icon: Car, color: "bg-finbud-green-light text-finbud-green" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "bg-finbud-purple-light text-finbud-purple" },
  { id: "entertainment", name: "Fun", icon: Film, color: "bg-finbud-gold-light text-finbud-gold" },
  { id: "subscriptions", name: "Subs", icon: Smartphone, color: "bg-finbud-blue-light text-primary" },
  { id: "rent", name: "Rent", icon: Home, color: "bg-finbud-blue-light text-primary" },
  { id: "education", name: "School", icon: GraduationCap, color: "bg-finbud-purple-light text-finbud-purple" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "bg-muted text-muted-foreground" },
];

const iconMap: Record<string, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Film,
  subscriptions: Smartphone,
  rent: Home,
  education: GraduationCap,
  other: MoreHorizontal,
};

export function AddExpenseModal({ open, onOpenChange, categories, onAddTransaction }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayCategories = categories?.length 
    ? categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: iconMap[cat.icon] || MoreHorizontal,
        color: `bg-${cat.color}-light text-${cat.color}` || "bg-muted text-muted-foreground",
      }))
    : defaultCategories;

  const handleSubmit = async () => {
    if (!amount || !selectedCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    if (onAddTransaction) {
      const { error } = await onAddTransaction({
        amount: parseFloat(amount),
        merchant: merchant || undefined,
        category_id: selectedCategory,
        type: 'expense',
        description: merchant || 'Expense',
      });

      if (error) {
        toast.error("Failed to add expense");
        setIsSubmitting(false);
        return;
      }
    }
    
    const categoryName = displayCategories.find(c => c.id === selectedCategory)?.name;
    toast.success(`Expense of $${amount} added successfully!`, {
      description: `Category: ${categoryName}`
    });
    
    setAmount("");
    setMerchant("");
    setSelectedCategory("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Expense</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-2xl font-bold h-14 rounded-2xl border-2 focus:border-primary"
              />
            </div>
          </div>
          
          {/* Merchant Input */}
          <div className="space-y-2">
            <Label htmlFor="merchant" className="text-sm text-muted-foreground">Merchant (optional)</Label>
            <Input
              id="merchant"
              placeholder="Where did you spend?"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="h-12 rounded-2xl border-2 focus:border-primary"
            />
          </div>
          
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category</Label>
            <div className="grid grid-cols-4 gap-2">
              {displayCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary-foreground/20" : "bg-card"
                    )}>
                      <Icon className={cn("w-5 h-5", isSelected && "text-primary-foreground")} />
                    </div>
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full h-12 rounded-2xl"
            variant="hero"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
