import { Coins, Wallet } from "lucide-react";
import { getAvatarEmoji } from "@/components/modals/AvatarPickerModal";
import { format } from "date-fns";

interface HeaderProps {
  userName: string;
  points: number;
  avatarChoice?: string | null;
  onLogoClick?: () => void;
}

export function Header({ userName, points, avatarChoice, onLogoClick }: HeaderProps) {
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      {/* Center Logo */}
      <div className="flex justify-center py-2 border-b border-border/30">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center shadow-finbud">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FinBud</span>
        </button>
      </div>
      
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
            {/* Points Badge */}
            <div className="flex items-center gap-1 bg-finbud-gold-light px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-finbud-gold" />
              <span className="text-sm font-semibold text-foreground">{points}</span>
            </div>
          </div>
        </div>
        
        {/* Date display */}
        <p className="text-xs text-muted-foreground mt-2 text-center">{formattedDate}</p>
      </div>
    </header>
  );
}
