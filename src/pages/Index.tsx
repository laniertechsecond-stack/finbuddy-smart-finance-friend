import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeView } from "@/components/views/HomeView";
import { BudgetView } from "@/components/views/BudgetView";
import { LearnView } from "@/components/views/LearnView";
import { ChatView } from "@/components/views/ChatView";
import { ProfileView } from "@/components/views/ProfileView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

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
        userName="Sam" 
        points={250} 
        streak={5} 
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
