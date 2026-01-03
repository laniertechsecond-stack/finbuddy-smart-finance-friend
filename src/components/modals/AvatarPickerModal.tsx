import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface AvatarPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AvatarPickerModal({ open, onOpenChange }: AvatarPickerModalProps) {
  const { profile, updateProfile } = useProfile();
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_choice || 'fox');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ avatar_choice: selectedAvatar });
    setSaving(false);
    
    if (error) {
      toast.error("Failed to update avatar");
    } else {
      toast.success("Avatar updated!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 py-4">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={cn(
                "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all",
                selectedAvatar === avatar.id
                  ? "bg-primary/10 ring-2 ring-primary scale-105"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <span className="text-3xl">{avatar.emoji}</span>
              <span className="text-xs mt-1 text-muted-foreground">{avatar.name}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Avatar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getAvatarEmoji(avatarChoice: string | null | undefined): string {
  const avatar = avatarOptions.find(a => a.id === avatarChoice);
  return avatar?.emoji || '🦊';
}
