import { useState } from "react";
import { 
  ArrowLeft, 
  Coins, 
  BookOpen, 
  Palette, 
  Sparkles, 
  FolderPlus,
  Crown,
  Lock,
  Check,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShopViewProps {
  onBack: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: typeof BookOpen;
  category: 'modules' | 'features' | 'categories' | 'themes';
  color: string;
  bgColor: string;
}

const shopItems: ShopItem[] = [
  // Learning Modules
  { 
    id: 'module_taxes', 
    name: 'Taxes 101', 
    description: 'Learn about filing taxes and deductions', 
    price: 100, 
    icon: BookOpen, 
    category: 'modules',
    color: 'text-finbud-blue',
    bgColor: 'bg-finbud-blue-light'
  },
  { 
    id: 'module_crypto', 
    name: 'Crypto Basics', 
    description: 'Understand cryptocurrency fundamentals', 
    price: 150, 
    icon: BookOpen, 
    category: 'modules',
    color: 'text-finbud-purple',
    bgColor: 'bg-finbud-purple-light'
  },
  { 
    id: 'module_real_estate', 
    name: 'Real Estate Investing', 
    description: 'Learn property investment strategies', 
    price: 200, 
    icon: BookOpen, 
    category: 'modules',
    color: 'text-finbud-green',
    bgColor: 'bg-finbud-green-light'
  },
  
  // Advanced Features
  { 
    id: 'feature_analytics', 
    name: 'Advanced Analytics', 
    description: 'Detailed spending insights and charts', 
    price: 250, 
    icon: Sparkles, 
    category: 'features',
    color: 'text-finbud-gold',
    bgColor: 'bg-finbud-gold-light'
  },
  { 
    id: 'feature_export', 
    name: 'CSV Export', 
    description: 'Export your data to spreadsheets', 
    price: 150, 
    icon: Sparkles, 
    category: 'features',
    color: 'text-finbud-coral',
    bgColor: 'bg-finbud-coral-light'
  },
  { 
    id: 'feature_predictions', 
    name: 'Spending Predictions', 
    description: 'AI-powered spending forecasts', 
    price: 300, 
    icon: Sparkles, 
    category: 'features',
    color: 'text-finbud-blue',
    bgColor: 'bg-finbud-blue-light'
  },
  
  // Extra Categories
  { 
    id: 'category_health', 
    name: 'Health & Wellness', 
    description: 'Track gym, supplements, and medical expenses', 
    price: 50, 
    icon: FolderPlus, 
    category: 'categories',
    color: 'text-finbud-green',
    bgColor: 'bg-finbud-green-light'
  },
  { 
    id: 'category_education', 
    name: 'Education', 
    description: 'Track courses, books, and learning materials', 
    price: 50, 
    icon: FolderPlus, 
    category: 'categories',
    color: 'text-finbud-purple',
    bgColor: 'bg-finbud-purple-light'
  },
  { 
    id: 'category_pets', 
    name: 'Pets', 
    description: 'Track pet food, vet visits, and supplies', 
    price: 50, 
    icon: FolderPlus, 
    category: 'categories',
    color: 'text-finbud-coral',
    bgColor: 'bg-finbud-coral-light'
  },
  
  // Themes
  { 
    id: 'theme_dark_gold', 
    name: 'Gold Theme', 
    description: 'Luxurious gold accent colors', 
    price: 75, 
    icon: Palette, 
    category: 'themes',
    color: 'text-finbud-gold',
    bgColor: 'bg-finbud-gold-light'
  },
  { 
    id: 'theme_midnight', 
    name: 'Midnight Theme', 
    description: 'Deep blue night mode aesthetics', 
    price: 75, 
    icon: Palette, 
    category: 'themes',
    color: 'text-finbud-blue',
    bgColor: 'bg-finbud-blue-light'
  },
  { 
    id: 'theme_nature', 
    name: 'Nature Theme', 
    description: 'Calming green earth tones', 
    price: 75, 
    icon: Palette, 
    category: 'themes',
    color: 'text-finbud-green',
    bgColor: 'bg-finbud-green-light'
  },
];

const categories = [
  { id: 'all', label: 'All', icon: ShoppingBag },
  { id: 'modules', label: 'Modules', icon: BookOpen },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'categories', label: 'Categories', icon: FolderPlus },
  { id: 'themes', label: 'Themes', icon: Palette },
];

export function ShopView({ onBack }: ShopViewProps) {
  const { profile, updateProfile } = useProfile();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  
  const userPoints = profile?.total_points || 0;
  const purchasedItems: string[] = []; // In a real app, this would come from the database

  const filteredItems = activeCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeCategory);

  const handlePurchase = async (item: ShopItem) => {
    if (userPoints < item.price) {
      toast.error("Not enough tokens! Complete lessons to earn more.");
      return;
    }
    
    setPurchasing(true);
    
    // Deduct tokens
    const newPoints = userPoints - item.price;
    const { error } = await updateProfile({ total_points: newPoints });
    
    setPurchasing(false);
    setSelectedItem(null);
    
    if (error) {
      toast.error("Purchase failed. Please try again.");
    } else {
      toast.success(`🎉 You purchased ${item.name}!`);
      // In a real app, you would also save the purchased item to the database
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Token Shop</h2>
            <p className="text-sm text-muted-foreground">Spend your hard-earned tokens</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-finbud-gold-light px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-finbud-gold" />
          <span className="font-bold text-foreground">{userPoints}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = userPoints >= item.price;
          
          return (
            <div
              key={item.id}
              onClick={() => !isPurchased && setSelectedItem(item)}
              className={cn(
                "bg-card rounded-2xl p-4 shadow-sm transition-all animate-slide-up",
                isPurchased 
                  ? "opacity-60 cursor-default" 
                  : "hover:shadow-finbud cursor-pointer"
              )}
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", item.bgColor)}>
                  <Icon className={cn("w-7 h-7", item.color)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    {isPurchased && (
                      <span className="bg-finbud-green-light text-finbud-green text-xs px-2 py-0.5 rounded-full">
                        Owned
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full",
                    canAfford ? "bg-finbud-gold-light" : "bg-muted"
                  )}>
                    <Coins className={cn("w-4 h-4", canAfford ? "text-finbud-gold" : "text-muted-foreground")} />
                    <span className={cn("font-semibold", canAfford ? "text-foreground" : "text-muted-foreground")}>
                      {item.price}
                    </span>
                  </div>
                  {!canAfford && !isPurchased && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Need {item.price - userPoints} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 bg-muted rounded-2xl p-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", selectedItem.bgColor)}>
                  <selectedItem.icon className={cn("w-7 h-7", selectedItem.color)} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-finbud-gold-light rounded-xl p-3">
                <span className="text-muted-foreground">Cost</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-finbud-gold" />
                  <span className="font-bold text-foreground">{selectedItem.price}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Your Balance</span>
                <span className="font-semibold text-foreground">{userPoints} tokens</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">After Purchase</span>
                <span className={cn(
                  "font-bold",
                  userPoints - selectedItem.price >= 0 ? "text-finbud-green" : "text-destructive"
                )}>
                  {userPoints - selectedItem.price} tokens
                </span>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="hero" 
                  className="flex-1" 
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={userPoints < selectedItem.price || purchasing}
                >
                  {purchasing ? "Purchasing..." : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
