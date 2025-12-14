import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeView } from "@/components/views/HomeView";
import { BudgetView } from "@/components/views/BudgetView";
import { LearnView } from "@/components/views/LearnView";
import { ChatView } from "@/components/views/ChatView";
import { ProfileView } from "@/components/views/ProfileView";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView />;
      case "budget":
        return <BudgetView />;
      case "learn":
        return <LearnView />;
      case "chat":
        return <ChatView />;
      case "profile":
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={userName} 
        points={points} 
        streak={streak} 
      />
      
      <main className="max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
