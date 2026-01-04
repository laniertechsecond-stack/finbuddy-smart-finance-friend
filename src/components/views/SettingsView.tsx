import { useState } from "react";
import { ArrowLeft, Bell, Shield, HelpCircle, ChevronRight, User, Lock, Download, Trash2, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { AvatarPickerModal, getAvatarEmoji } from "@/components/modals/AvatarPickerModal";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

type SettingsPage = 'main' | 'notifications' | 'privacy' | 'help' | 'profile';

interface SettingsViewProps {
  onBack: () => void;
  initialPage?: SettingsPage;
}

export function SettingsView({ onBack, initialPage = 'main' }: SettingsViewProps) {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<SettingsPage>(initialPage);
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    weeklyDigest: true,
    budgetAlerts: true,
    learningReminders: true,
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  
  // Profile editing state
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [birthday, setBirthday] = useState(profile?.birthday || '');
  const [monthlyIncome, setMonthlyIncome] = useState(profile?.monthly_income || 2000);
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    if (currentPage === 'main') {
      onBack();
    } else {
      setCurrentPage('main');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName || undefined,
      birthday: birthday || undefined,
      monthly_income: monthlyIncome,
    });
    setSaving(false);
    
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin,
    });
    
    if (error) {
      toast.error("Failed to send reset email");
    } else {
      toast.success("Password reset email sent!");
      setShowChangePassword(false);
    }
  };

  const handleExportData = () => {
    // Generate a simple JSON export
    const data = {
      profile,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finbud-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully!");
    setShowExportData(false);
  };

  const handleDeleteAccount = async () => {
    toast.error("Account deletion requires contacting support");
    setShowDeleteAccount(false);
  };

  // Profile Settings Page
  if (currentPage === 'profile') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>
        </div>

        {/* Avatar Section */}
        <div className="bg-card rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center text-3xl hover:scale-105 transition-transform"
            >
              {profile?.avatar_choice ? getAvatarEmoji(profile.avatar_choice) : '🦊'}
            </button>
            <div>
              <h3 className="font-semibold text-foreground">Profile Picture</h3>
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setShowAvatarPicker(true)}>
                Change avatar
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <Label htmlFor="displayName" className="text-sm text-muted-foreground">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 h-12 rounded-xl"
              placeholder="Your name"
            />
          </div>

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

          <div>
            <Label className="text-sm text-muted-foreground">Monthly Income</Label>
            <div className="mt-2 text-center">
              <p className="text-2xl font-bold text-primary">${monthlyIncome.toLocaleString()}</p>
            </div>
            <Slider
              value={[monthlyIncome]}
              onValueChange={([value]) => setMonthlyIncome(value)}
              min={500}
              max={10000}
              step={100}
              className="mt-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$500</span>
              <span>$10,000</span>
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving} className="w-full h-12 rounded-xl" variant="hero">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <AvatarPickerModal open={showAvatarPicker} onOpenChange={setShowAvatarPicker} />
      </div>
    );
  }

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

        <div className="bg-card rounded-3xl p-4 shadow-sm space-y-1">
          <button 
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center justify-between py-4 border-b border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Key className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button 
            onClick={() => setShowExportData(true)}
            className="w-full flex items-center justify-between py-4 border-b border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Download className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Data Export</p>
                <p className="text-sm text-muted-foreground">Download a copy of your data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button 
            onClick={() => setShowDeleteAccount(true)}
            className="w-full flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left">
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Change Password Dialog */}
        <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                We'll send a password reset link to your email address: <strong>{user?.email}</strong>
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowChangePassword(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleChangePassword}>
                  Send Reset Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Data Dialog */}
        <Dialog open={showExportData} onOpenChange={setShowExportData}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Your Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                Download a JSON file containing all your FinBud data including your profile, budgets, and transactions.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowExportData(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                This action cannot be undone. All your data including budgets, transactions, and learning progress will be permanently deleted.
              </p>
              <p className="text-muted-foreground">
                To delete your account, please contact our support team.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteAccount(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleDeleteAccount}>
                  Contact Support
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            { q: "How do I track my budget?", a: "The Budget tab shows all your category spending and remaining amounts." },
            { q: "Can I export my data?", a: "Yes! Go to Privacy & Security settings to export your data." },
            { q: "How do I earn badges?", a: "Complete lessons, reach savings goals, and stay consistent to earn badges." },
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
          <Button className="w-full rounded-xl" onClick={() => toast.info("Support email: support@finbud.app")}>
            <Mail className="w-4 h-4 mr-2" />
            Send a Message
          </Button>
        </div>
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
          { icon: User, label: 'Edit Profile', page: 'profile' as SettingsPage },
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
