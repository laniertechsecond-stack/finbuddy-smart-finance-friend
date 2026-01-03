import { useState } from "react";
import { ArrowLeft, Bell, Shield, HelpCircle, CreditCard, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SettingsPage = 'main' | 'notifications' | 'privacy' | 'help' | 'payment';

interface SettingsViewProps {
  onBack: () => void;
  initialPage?: SettingsPage;
}

export function SettingsView({ onBack, initialPage = 'main' }: SettingsViewProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>(initialPage);
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    weeklyDigest: true,
    budgetAlerts: true,
    learningReminders: true,
    streakReminders: true,
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState([
    { id: '1', last4: '4242', brand: 'Visa', isDefault: true },
  ]);

  const handleBack = () => {
    if (currentPage === 'main') {
      onBack();
    } else {
      setCurrentPage('main');
    }
  };

  const addCard = () => {
    const newCard = {
      id: Date.now().toString(),
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      brand: ['Visa', 'Mastercard', 'Amex'][Math.floor(Math.random() * 3)],
      isDefault: cards.length === 0,
    };
    setCards([...cards, newCard]);
    setShowAddCard(false);
    toast.success("Card added successfully");
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success("Card removed");
  };

  const setDefaultCard = (id: string) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
    toast.success("Default card updated");
  };

  if (currentPage === 'notifications') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-sm space-y-4">
          {[
            { key: 'pushEnabled', label: 'Push Notifications', desc: 'Receive push notifications' },
            { key: 'emailEnabled', label: 'Email Notifications', desc: 'Receive email updates' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a weekly summary email' },
            { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Notify when approaching limits' },
            { key: 'learningReminders', label: 'Learning Reminders', desc: 'Daily lesson reminders' },
            { key: 'streakReminders', label: 'Streak Reminders', desc: 'Keep your streak going' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                onCheckedChange={(checked) =>
                  setNotificationSettings(prev => ({ ...prev, [item.key]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Privacy & Security</h2>
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-sm space-y-4">
          <button className="w-full flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground text-left">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground text-left">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground text-left">Data Export</p>
              <p className="text-sm text-muted-foreground">Download a copy of your data</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between py-3 text-destructive">
            <div>
              <p className="font-medium text-left">Delete Account</p>
              <p className="text-sm opacity-70">Permanently delete your account and data</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'help') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Help Center</h2>
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
          {[
            { q: "How do I add an expense?", a: "Go to the Home tab and tap 'Add Expense' in Quick Actions." },
            { q: "How do streaks work?", a: "Complete at least one lesson or log an expense daily to maintain your streak." },
            { q: "Can I export my data?", a: "Yes! Go to Privacy & Security settings to export your data." },
            { q: "How do I earn badges?", a: "Complete lessons, reach savings goals, and maintain streaks to earn badges." },
          ].map((faq, i) => (
            <div key={i} className="py-3 border-b border-border last:border-0">
              <p className="font-medium text-foreground">{faq.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
          <p className="text-muted-foreground text-sm mb-4">Need more help? Our team is here for you.</p>
          <Button className="w-full rounded-xl">Send a Message</Button>
        </div>
      </div>
    );
  }

  if (currentPage === 'payment') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
        </div>

        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="bg-card rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{card.brand} •••• {card.last4}</p>
                {card.isDefault && (
                  <span className="text-xs text-primary font-medium">Default</span>
                )}
              </div>
              <div className="flex gap-2">
                {!card.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => setDefaultCard(card.id)}>
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeCard(card.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => setShowAddCard(true)} className="w-full rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>

        <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Card Number</Label>
                <Input placeholder="1234 5678 9012 3456" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label>CVC</Label>
                  <Input placeholder="123" className="mt-1" />
                </div>
              </div>
              <Button className="w-full" onClick={addCard}>Add Card</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main settings page
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      </div>

      <div className="bg-card rounded-3xl shadow-sm overflow-hidden">
        {[
          { icon: CreditCard, label: 'Payment Methods', page: 'payment' as SettingsPage },
          { icon: Bell, label: 'Notifications', page: 'notifications' as SettingsPage },
          { icon: Shield, label: 'Privacy & Security', page: 'privacy' as SettingsPage },
          { icon: HelpCircle, label: 'Help Center', page: 'help' as SettingsPage },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentPage(item.page)}
              className={cn(
                "w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                index !== 3 && "border-b border-border"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
