import { useState } from "react";
import { 
  Settings, 
  ChevronRight,
  Shield,
  HelpCircle,
  LogOut,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { AvatarPickerModal, getAvatarEmoji } from "@/components/modals/AvatarPickerModal";

type SettingsPage = 'main' | 'privacy' | 'help' | 'profile';

interface ProfileViewProps {
  onNavigateToGoals?: () => void;
  onNavigateToSettings?: (page?: SettingsPage) => void;
}

export function ProfileView({ onNavigateToGoals, onNavigateToSettings }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const userName = profile?.display_name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const menuItems = [
    { icon: Settings, label: "Edit Profile", action: () => onNavigateToSettings?.('profile' as any) },
    { icon: Shield, label: "Privacy & Security", action: () => onNavigateToSettings?.('privacy') },
    { icon: HelpCircle, label: "Help Center", action: () => onNavigateToSettings?.('help') },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setShowAvatarPicker(true)}
            className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
          >
            {profile?.avatar_choice ? getAvatarEmoji(profile.avatar_choice) : userName.charAt(0).toUpperCase()}
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onNavigateToSettings?.()}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <button 
          onClick={onNavigateToGoals}
          className="bg-finbud-purple-light rounded-2xl p-4 text-center hover:scale-105 transition-transform"
        >
          <Target className="w-6 h-6 text-finbud-purple mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">Goals</p>
          <p className="text-xs text-muted-foreground">View All</p>
        </button>
        <button 
          onClick={() => onNavigateToSettings?.('profile')}
          className="bg-finbud-green-light rounded-2xl p-4 text-center hover:scale-105 transition-transform"
        >
          <Settings className="w-6 h-6 text-finbud-green mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">Settings</p>
          <p className="text-xs text-muted-foreground">Manage</p>
        </button>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-3xl shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={cn(
                "w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                index !== menuItems.length - 1 && "border-b border-border"
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

      {/* Logout Button */}
      <Button 
        onClick={handleSignOut}
        variant="outline" 
        className="w-full h-12 rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>

      <AvatarPickerModal open={showAvatarPicker} onOpenChange={setShowAvatarPicker} />
    </div>
  );
}
