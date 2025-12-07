import { useState } from "react";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Clock,
  ChevronRight,
  Zap,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Receipt,
  Wallet,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  points: number;
  completed: boolean;
  locked: boolean;
  icon: typeof BookOpen;
}

interface Module {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: string;
  bgColor: string;
  icon: typeof BookOpen;
  lessons: Lesson[];
}

const modules: Module[] = [
  {
    id: "budgeting",
    title: "Budgeting Basics",
    description: "Master the fundamentals of money management",
    progress: 75,
    color: "text-finbud-blue",
    bgColor: "bg-finbud-blue-light",
    icon: Wallet,
    lessons: [
      { id: "1", title: "What is a Budget?", description: "Learn the basics", duration: 3, points: 25, completed: true, locked: false, icon: BookOpen },
      { id: "2", title: "The 50/30/20 Rule", description: "Allocate your income", duration: 5, points: 30, completed: true, locked: false, icon: BookOpen },
      { id: "3", title: "Tracking Expenses", description: "Know where your money goes", duration: 4, points: 25, completed: true, locked: false, icon: BookOpen },
      { id: "4", title: "Emergency Funds", description: "Build your safety net", duration: 4, points: 30, completed: false, locked: false, icon: BookOpen },
    ]
  },
  {
    id: "credit",
    title: "Credit Score 101",
    description: "Build and maintain good credit",
    progress: 25,
    color: "text-finbud-purple",
    bgColor: "bg-finbud-purple-light",
    icon: CreditCard,
    lessons: [
      { id: "5", title: "What is a Credit Score?", description: "Understanding the basics", duration: 4, points: 25, completed: true, locked: false, icon: BookOpen },
      { id: "6", title: "Credit Utilization", description: "How much to use", duration: 5, points: 30, completed: false, locked: false, icon: BookOpen },
      { id: "7", title: "Building Credit History", description: "Start your journey", duration: 6, points: 35, completed: false, locked: true, icon: BookOpen },
    ]
  },
  {
    id: "saving",
    title: "Saving Strategies",
    description: "Grow your money over time",
    progress: 0,
    color: "text-finbud-green",
    bgColor: "bg-finbud-green-light",
    icon: PiggyBank,
    lessons: [
      { id: "8", title: "Pay Yourself First", description: "Prioritize savings", duration: 3, points: 25, completed: false, locked: false, icon: BookOpen },
      { id: "9", title: "High-Yield Savings", description: "Maximize your returns", duration: 4, points: 30, completed: false, locked: true, icon: BookOpen },
    ]
  },
  {
    id: "investing",
    title: "Investing 101",
    description: "Start your investment journey",
    progress: 0,
    color: "text-finbud-gold",
    bgColor: "bg-finbud-gold-light",
    icon: TrendingUp,
    lessons: [
      { id: "10", title: "What are Stocks?", description: "Ownership basics", duration: 5, points: 30, completed: false, locked: true, icon: BookOpen },
      { id: "11", title: "Index Funds", description: "Diversified investing", duration: 6, points: 35, completed: false, locked: true, icon: BookOpen },
    ]
  },
];

export function LearnView() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const totalPoints = 250;
  const earnedPoints = 135;
  const completedLessons = 4;
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  if (selectedModule) {
    return (
      <div className="space-y-6 pb-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setSelectedModule(null)}
          className="mb-2"
        >
          ← Back to Modules
        </Button>
        
        {/* Module Header */}
        <div className={cn("rounded-3xl p-6", selectedModule.bgColor)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-finbud">
              <selectedModule.icon className={cn("w-8 h-8", selectedModule.color)} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedModule.title}</h1>
              <p className="text-muted-foreground">{selectedModule.description}</p>
            </div>
          </div>
          <Progress value={selectedModule.progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">{selectedModule.progress}% complete</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {selectedModule.lessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              className={cn(
                "bg-card rounded-2xl p-4 shadow-sm transition-all animate-slide-up",
                lesson.locked ? "opacity-60" : "hover:shadow-finbud cursor-pointer"
              )}
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  lesson.completed 
                    ? "bg-finbud-green-light" 
                    : lesson.locked 
                      ? "bg-muted" 
                      : selectedModule.bgColor
                )}>
                  {lesson.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-finbud-green" />
                  ) : lesson.locked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <BookOpen className={cn("w-5 h-5", selectedModule.color)} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {lesson.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-finbud-gold">
                      <Star className="w-3 h-3" />
                      +{lesson.points} pts
                    </span>
                  </div>
                </div>
                
                {!lesson.locked && !lesson.completed && (
                  <Button variant="soft" size="sm" className="rounded-xl">
                    Start
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Progress Overview */}
      <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Your Progress</h2>
              <p className="text-sm text-muted-foreground">{completedLessons} of {totalLessons} lessons completed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-finbud-gold">
              <Star className="w-5 h-5 fill-finbud-gold" />
              <span className="text-xl font-bold">{earnedPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground">points earned</p>
          </div>
        </div>
        
        <Progress value={(completedLessons / totalLessons) * 100} className="h-3" />
      </div>

      {/* Daily Challenge */}
      <div className="bg-finbud-gold-light rounded-3xl p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-finbud-gold flex items-center justify-center">
            <Zap className="w-7 h-7 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Daily Challenge</h3>
            <p className="text-sm text-muted-foreground">Complete 1 lesson to maintain your streak!</p>
          </div>
          <Button variant="gold" size="sm" className="rounded-xl">
            Go
          </Button>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground px-1">Learning Modules</h3>
        
        {modules.map((module, index) => {
          const Icon = module.icon;
          const completedCount = module.lessons.filter(l => l.completed).length;
          
          return (
            <div 
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="bg-card rounded-3xl p-5 shadow-sm hover:shadow-finbud transition-all cursor-pointer animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 2)}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", module.bgColor)}>
                  <Icon className={cn("w-7 h-7", module.color)} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={module.progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {completedCount}/{module.lessons.length}
                    </span>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
