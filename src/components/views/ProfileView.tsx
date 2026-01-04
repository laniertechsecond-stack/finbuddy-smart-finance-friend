import { useState } from "react";
import { 
  Settings, 
  Trophy, 
  Star, 
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Medal,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useBadges } from "@/hooks/useBadges";
import { toast } from "sonner";
import { AvatarPickerModal, getAvatarEmoji } from "@/components/modals/AvatarPickerModal";

type SettingsPage = 'main' | 'notifications' | 'privacy' | 'help' | 'profile';

interface ProfileViewProps {
  onNavigateToGoals?: () => void;
  onNavigateToBadges?: () => void;
  onNavigateToSettings?: (page?: SettingsPage) => void;
}

const badgeIcons: Record<string, any> = {
  Star, Target, Zap, Medal, Trophy
};

export function ProfileView({ onNavigateToGoals, onNavigateToBadges, onNavigateToSettings }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { badges, userBadges } = useBadges();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const userName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const level = profile?.level || 1;
  const currentXP = profile?.current_xp || 0;
  const nextLevelXP = level * 150;
  const xpProgress = (currentXP / nextLevelXP) * 100;
  const totalPoints = profile?.total_points || 0;

  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
  const displayBadges = badges.slice(0, 6).map(badge => ({
    ...badge,
    earned: earnedBadgeIds.includes(badge.id),
    Icon: badgeIcons[badge.icon] || Star
  }));

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const menuItems = [
    { icon: Settings, label: "Edit Profile", action: () => onNavigateToSettings?.('profile' as any) },
    { icon: Bell, label: "Notifications", action: () => onNavigateToSettings?.('notifications') },
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

        {/* Level Progress */}
        <div className="bg-muted rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-finbud-gold flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">{level}</span>
              </div>
              <span className="font-semibold text-foreground">Level {level}</span>
            </div>
            <span className="text-sm text-muted-foreground">{currentXP}/{nextLevelXP} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{nextLevelXP - currentXP} XP to Level {level + 1}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-finbud-gold-light rounded-2xl p-4 text-center">
          <Star className="w-6 h-6 text-finbud-gold mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        <button 
          onClick={onNavigateToGoals}
          className="bg-finbud-purple-light rounded-2xl p-4 text-center hover:scale-105 transition-transform"
        >
          <Target className="w-6 h-6 text-finbud-purple mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">Goals</p>
          <p className="text-xs text-muted-foreground">View All</p>
        </button>
      </div>

      {/* Badges Section */}
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-semibold text-foreground">My Badges</h3>
          <button 
            className="text-sm font-medium text-primary"
            onClick={onNavigateToBadges}
          >
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {displayBadges.map((badge) => {
            const Icon = badge.Icon;
            return (
              <button
                key={badge.id}
                onClick={() => !badge.earned && toast.info(`🔓 ${badge.unlock_criteria}`)}
                className={cn(
                  "bg-card rounded-2xl p-4 text-center transition-all",
                  badge.earned 
                    ? "shadow-sm hover:shadow-finbud" 
                    : "opacity-40 hover:opacity-60"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center",
                  badge.earned ? "bg-finbud-gold-light" : "bg-muted"
                )}>
                  <Icon className={cn("w-6 h-6", badge.earned ? "text-finbud-gold" : "text-muted-foreground")} />
                </div>
                <p className="text-xs font-medium text-foreground truncate">{badge.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-3xl shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
