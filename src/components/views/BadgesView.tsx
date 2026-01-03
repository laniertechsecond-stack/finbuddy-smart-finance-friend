import { Star, Target, Zap, Flame, Medal, Trophy, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBadges } from "@/hooks/useBadges";
import { cn } from "@/lib/utils";

interface BadgesViewProps {
  onBack: () => void;
}

const badgeIcons: Record<string, any> = {
  Star, Target, Zap, Flame, Medal, Trophy
};

export function BadgesView({ onBack }: BadgesViewProps) {
  const { badges, userBadges, loading } = useBadges();

  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Badges</h2>
          <p className="text-muted-foreground">
            {earnedBadgeIds.length} of {badges.length} badges earned
          </p>
        </div>
      </div>

      {/* Earned Badges */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Earned</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges
            .filter(badge => earnedBadgeIds.includes(badge.id))
            .map((badge) => {
              const Icon = badgeIcons[badge.icon] || Star;
              return (
                <div
                  key={badge.id}
                  className="bg-card rounded-2xl p-4 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl bg-finbud-gold-light mx-auto mb-3 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-finbud-gold" />
                  </div>
                  <h4 className="font-semibold text-foreground text-center">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                </div>
              );
            })}
        </div>
        {earnedBadgeIds.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No badges earned yet. Keep learning and saving!</p>
        )}
      </div>

      {/* Locked Badges */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Locked</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges
            .filter(badge => !earnedBadgeIds.includes(badge.id))
            .map((badge) => {
              const Icon = badgeIcons[badge.icon] || Star;
              return (
                <div
                  key={badge.id}
                  className="bg-muted/50 rounded-2xl p-4 opacity-60"
                >
                  <div className="w-16 h-16 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center relative">
                    <Icon className="w-8 h-8 text-muted-foreground" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-muted-foreground text-center">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                  <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                    <p className="text-xs text-primary text-center font-medium">
                      🔓 {badge.unlock_criteria}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
