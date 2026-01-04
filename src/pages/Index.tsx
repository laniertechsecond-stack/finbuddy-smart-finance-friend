import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeView } from "@/components/views/HomeView";
import { BudgetView } from "@/components/views/BudgetView";
import { LearnView } from "@/components/views/LearnView";
import { ChatView } from "@/components/views/ChatView";
import { ProfileView } from "@/components/views/ProfileView";
import { GoalsView } from "@/components/views/GoalsView";
import { BadgesView } from "@/components/views/BadgesView";
import { SettingsView } from "@/components/views/SettingsView";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

type TabType = "home" | "budget" | "learn" | "chat" | "profile" | "goals" | "badges" | "settings";
type SettingsPage = 'main' | 'notifications' | 'privacy' | 'help' | 'payment';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [settingsPage, setSettingsPage] = useState<SettingsPage>('main');
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const points = profile?.total_points || 0;
  const streak = profile?.current_streak || 0;

  const navigateToSettings = (page: SettingsPage = 'main') => {
    setSettingsPage(page);
    setActiveTab("settings");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView 
            onNavigateToLearn={() => setActiveTab("learn")} 
            onNavigateToGoals={() => setActiveTab("goals")}
            onNavigateToSettings={(page) => navigateToSettings(page as SettingsPage || 'main')}
          />
        );
      case "budget":
        return <BudgetView />;
      case "learn":
        return <LearnView />;
      case "chat":
        return <ChatView />;
      case "profile":
        return (
          <ProfileView 
            onNavigateToGoals={() => setActiveTab("goals")}
            onNavigateToBadges={() => setActiveTab("badges")}
            onNavigateToSettings={navigateToSettings}
          />
        );
      case "goals":
        return <GoalsView />;
      case "badges":
        return <BadgesView onBack={() => setActiveTab("profile")} />;
      case "settings":
        return <SettingsView onBack={() => setActiveTab("profile")} initialPage={settingsPage} />;
      default:
        return (
          <HomeView 
            onNavigateToLearn={() => setActiveTab("learn")} 
            onNavigateToGoals={() => setActiveTab("goals")}
            onNavigateToSettings={(page) => navigateToSettings(page as SettingsPage || 'main')}
          />
        );
    }
  };

  const showHeader = !["badges", "settings", "goals"].includes(activeTab);

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header 
          userName={userName} 
          points={points} 
          streak={streak}
          avatarChoice={profile?.avatar_choice}
        />
      )}
      
      <main className="max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      <BottomNav 
        activeTab={["goals", "badges", "settings"].includes(activeTab) ? "profile" : activeTab} 
        onTabChange={(tab) => setActiveTab(tab as TabType)} 
      />
    </div>
  );
};

export default Index;
