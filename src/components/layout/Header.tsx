import { Flame, Coins } from "lucide-react";
import { NotificationsPanel } from "@/components/modals/NotificationsPanel";
import { useNotifications } from "@/hooks/useNotifications";
import { getAvatarEmoji } from "@/components/modals/AvatarPickerModal";

interface HeaderProps {
  userName: string;
  points: number;
  streak: number;
  avatarChoice?: string | null;
}

export function Header({ userName, points, streak, avatarChoice }: HeaderProps) {
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg shadow-finbud">
              {avatarChoice ? getAvatarEmoji(avatarChoice) : userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="font-semibold text-foreground">{userName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 bg-finbud-coral-light px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-finbud-coral" />
              <span className="text-sm font-semibold text-finbud-coral">{streak}</span>
            </div>
            
            {/* Points Badge */}
            <div className="flex items-center gap-1 bg-finbud-gold-light px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-finbud-gold" />
              <span className="text-sm font-semibold text-foreground">{points}</span>
            </div>
            
            {/* Notifications */}
            <NotificationsPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
