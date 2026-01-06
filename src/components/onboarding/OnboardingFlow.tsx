import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Wallet, Calendar, DollarSign, Sparkles, ChevronRight, Check } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "sonner";
import finbudLogo from "@/assets/finbud-logo.png";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const avatarOptions = [
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'tiger', emoji: '🐯', name: 'Tiger' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'dragon', emoji: '🐲', name: 'Dragon' },
];

const defaultCategories = [
  { name: 'Food & Dining', icon: 'utensils', color: 'coral', defaultPercent: 25 },
  { name: 'Rent/Housing', icon: 'home', color: 'blue', defaultPercent: 35 },
  { name: 'Transport', icon: 'car', color: 'green', defaultPercent: 10 },
  { name: 'Shopping', icon: 'shopping-bag', color: 'purple', defaultPercent: 15 },
  { name: 'Entertainment', icon: 'film', color: 'gold', defaultPercent: 10 },
  { name: 'Subscriptions', icon: 'smartphone', color: 'blue', defaultPercent: 5 },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState('fox');
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState(
    defaultCategories.map(cat => ({
      ...cat,
      amount: Math.round((cat.defaultPercent / 100) * 2000)
    }))
  );
  const [saving, setSaving] = useState(false);
  
  const { updateProfile } = useProfile();
  const { updateCategory, addCategory, categories } = useBudget();

  const updateBudgets = (income: number) => {
    setCategoryBudgets(prev => prev.map(cat => ({
      ...cat,
      amount: Math.round((cat.defaultPercent / 100) * income)
    })));
  };

  const handleIncomeChange = (value: number) => {
    setMonthlyIncome(value);
    updateBudgets(value);
  };

  const handleCategoryBudgetChange = (index: number, value: number) => {
    setCategoryBudgets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], amount: value };
      return updated;
    });
  };

  const totalBudget = categoryBudgets.reduce((sum, cat) => sum + cat.amount, 0);

  const handleComplete = async () => {
    setSaving(true);
    try {
      // Update profile
      await updateProfile({
        display_name: displayName || undefined,
        avatar_choice: selectedAvatar,
        birthday: birthday || undefined,
        monthly_income: monthlyIncome,
        has_completed_onboarding: true,
      });

      // Create or update categories with custom budgets
      for (const cat of categoryBudgets) {
        const existingCategory = categories.find(c => c.name === cat.name);
        if (existingCategory) {
          await updateCategory(existingCategory.id, { budget_amount: cat.amount });
        } else {
          await addCategory({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            budget_amount: cat.amount,
          });
        }
      }

      toast.success("Welcome to FinBud! 🎉");
      onComplete();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              s === step ? "bg-primary w-8" : s < step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step 1: Avatar & Name */}
      {step === 1 && (
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <img src={finbudLogo} alt="FinBud" className="w-20 h-20 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">Let's personalize your experience</h1>
            <p className="text-muted-foreground mt-2">Choose an avatar and set your name</p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-finbud space-y-6">
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Pick your avatar</Label>
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center transition-all text-2xl",
                      selectedAvatar === avatar.id
                        ? "bg-primary/10 ring-2 ring-primary scale-105"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="displayName" className="text-sm text-muted-foreground">Display Name</Label>
              <Input
                id="displayName"
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 h-12 rounded-xl"
              />
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-12 rounded-xl" variant="hero">
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Birthday */}
      {step === 2 && (
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-finbud-purple-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-finbud-purple" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">When's your birthday?</h1>
            <p className="text-muted-foreground mt-2">This helps us personalize your experience</p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-finbud space-y-6">
            <div>
              <Label htmlFor="birthday" className="text-sm text-muted-foreground">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1 h-12 rounded-xl"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 h-12 rounded-xl" variant="hero">
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Monthly Income */}
      {step === 3 && (
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-finbud-green-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-finbud-green" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">What's your monthly income?</h1>
            <p className="text-muted-foreground mt-2">We'll help you budget effectively</p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-finbud space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">${monthlyIncome.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">per month</p>
            </div>

            <Slider
              value={[monthlyIncome]}
              onValueChange={([value]) => handleIncomeChange(value)}
              min={0}
              max={10000}
              step={100}
              className="my-6"
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0</span>
              <span>$10,000</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 h-12 rounded-xl" variant="hero">
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Budget Categories */}
      {step === 4 && (
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-finbud-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-finbud-gold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Set your budgets</h1>
            <p className="text-muted-foreground mt-2">Customize how much to spend in each category</p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-finbud space-y-4 max-h-[50vh] overflow-y-auto">
            {categoryBudgets.map((cat, index) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  <span className="text-sm font-bold text-primary">${cat.amount}</span>
                </div>
                <Slider
                  value={[cat.amount]}
                  onValueChange={([value]) => handleCategoryBudgetChange(index, value)}
                  min={0}
                  max={Math.max(monthlyIncome / 2, cat.amount + 200)}
                  step={25}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 bg-muted rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Monthly Budget</p>
            <p className={cn(
              "text-2xl font-bold",
              totalBudget > monthlyIncome ? "text-destructive" : "text-primary"
            )}>
              ${totalBudget.toLocaleString()}
            </p>
            {totalBudget > monthlyIncome && (
              <p className="text-xs text-destructive mt-1">Budget exceeds income!</p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12 rounded-xl">
              Back
            </Button>
            <Button 
              onClick={handleComplete} 
              disabled={saving}
              className="flex-1 h-12 rounded-xl" 
              variant="hero"
            >
              {saving ? "Setting up..." : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
