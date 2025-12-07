import { 
  User, 
  Settings, 
  Trophy, 
  Star, 
  Flame,
  ChevronRight,
  CreditCard,
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

const badges = [
  { id: "starter", name: "Starter", icon: Star, earned: true, color: "text-finbud-gold" },
  { id: "saver", name: "Saver Pro", icon: Target, earned: true, color: "text-finbud-green" },
  { id: "learner", name: "Quick Learner", icon: Zap, earned: true, color: "text-finbud-purple" },
  { id: "streak", name: "5 Day Streak", icon: Flame, earned: true, color: "text-finbud-coral" },
  { id: "ninja", name: "Budget Ninja", icon: Medal, earned: false, color: "text-muted-foreground" },
  { id: "champ", name: "Savings Champ", icon: Trophy, earned: false, color: "text-muted-foreground" },
];

const menuItems = [
  { icon: CreditCard, label: "Payment Methods", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Shield, label: "Privacy & Security", href: "#" },
  { icon: HelpCircle, label: "Help Center", href: "#" },
];

export function ProfileView() {
  const userName = "Sam";
  const level = 4;
  const currentXP = 350;
  const nextLevelXP = 500;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow">
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
            <p className="text-muted-foreground">student@university.edu</p>
          </div>
          <Button variant="ghost" size="icon">
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
      <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-finbud-gold-light rounded-2xl p-4 text-center">
          <Star className="w-6 h-6 text-finbud-gold mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">250</p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        <div className="bg-finbud-coral-light rounded-2xl p-4 text-center">
          <Flame className="w-6 h-6 text-finbud-coral mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-finbud-purple-light rounded-2xl p-4 text-center">
          <Trophy className="w-6 h-6 text-finbud-purple mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-semibold text-foreground">My Badges</h3>
          <button className="text-sm font-medium text-primary">See All</button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={cn(
                  "bg-card rounded-2xl p-4 text-center transition-all",
                  badge.earned 
                    ? "shadow-sm hover:shadow-finbud" 
                    : "opacity-40"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center",
                  badge.earned ? "bg-finbud-gold-light" : "bg-muted"
                )}>
                  <Icon className={cn("w-6 h-6", badge.color)} />
                </div>
                <p className="text-xs font-medium text-foreground truncate">{badge.name}</p>
              </div>
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
        variant="outline" 
        className="w-full h-12 rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
