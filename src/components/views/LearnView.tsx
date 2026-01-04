import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Zap,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useLearning } from "@/hooks/useLearning";
import { toast } from "sonner";

const iconMap: Record<string, typeof BookOpen> = {
  wallet: Wallet,
  'credit-card': CreditCard,
  'piggy-bank': PiggyBank,
  'trending-up': TrendingUp,
};

export function LearnView() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const {
    modules,
    lessonContent,
    loading,
    completeLesson,
    getModuleProgress,
    getNextLesson,
    isLessonLocked,
    isLessonCompleted,
    totalCompletedLessons,
    totalLessons,
  } = useLearning();

  const selectedModule = modules.find(m => m.id === selectedModuleId);
  const activeLesson = lessonContent.find(l => l.id === activeLessonId);
  const moduleLessons = lessonContent
    .filter(l => l.module_id === selectedModuleId)
    .sort((a, b) => a.order_index - b.order_index);

  const handleStartLesson = (lessonId: string) => {
    const lesson = lessonContent.find(l => l.id === lessonId);
    if (!lesson) return;
    
    if (isLessonLocked(lessonId, lesson.module_id)) {
      toast.error("Complete the previous lesson first!");
      return;
    }
    
    setActiveLessonId(lessonId);
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  const handleQuizSubmit = async () => {
    if (!activeLesson || quizAnswer === null) return;
    
    setShowQuizResult(true);
    
    if (quizAnswer === activeLesson.quiz_answer) {
      // Complete the lesson
      const points = 25 + (activeLesson.order_index * 5);
      await completeLesson(activeLesson.id, activeLesson.module_id, points);
      toast.success(`Correct! +${points} points earned!`);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = moduleLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < moduleLessons.length - 1) {
      handleStartLesson(moduleLessons[currentIndex + 1].id);
    } else {
      setActiveLessonId(null);
      toast.success("Module section complete!");
    }
  };

  const handleDailyChallenge = () => {
    const next = getNextLesson();
    if (next) {
      setSelectedModuleId(next.module.id);
      setTimeout(() => handleStartLesson(next.lesson.id), 100);
    } else {
      toast.info("You've completed all available lessons!");
    }
  };

  // Active Lesson View
  if (activeLesson) {
    return (
      <div className="space-y-6 pb-24">
        <Button 
          variant="ghost" 
          onClick={() => setActiveLessonId(null)}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        <div className="bg-card rounded-3xl p-6 shadow-finbud">
          <h1 className="text-2xl font-bold text-foreground mb-4">{activeLesson.title}</h1>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>,
                p: ({ children }) => <p className="my-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                strong: ({ children }) => <span className="font-bold">{children}</span>,
              }}
            >
              {activeLesson.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Quiz Section */}
        {activeLesson.quiz_question && activeLesson.quiz_options && (
          <div className="bg-finbud-purple-light rounded-3xl p-6">
            <h3 className="font-bold text-foreground mb-4">📝 Quick Quiz</h3>
            <p className="text-foreground mb-4">{activeLesson.quiz_question}</p>
            
            <div className="space-y-2 mb-4">
              {activeLesson.quiz_options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !showQuizResult && setQuizAnswer(idx)}
                  disabled={showQuizResult}
                  className={cn(
                    "w-full p-3 rounded-xl text-left transition-all",
                    quizAnswer === idx && !showQuizResult && "ring-2 ring-primary",
                    showQuizResult && idx === activeLesson.quiz_answer && "bg-finbud-green-light ring-2 ring-finbud-green",
                    showQuizResult && quizAnswer === idx && idx !== activeLesson.quiz_answer && "bg-finbud-coral-light ring-2 ring-finbud-coral",
                    !showQuizResult && "bg-card hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {!showQuizResult ? (
              <Button 
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null}
                className="w-full"
                variant="hero"
              >
                Submit Answer
              </Button>
            ) : (
              <div className="space-y-3">
                {quizAnswer === activeLesson.quiz_answer ? (
                  <p className="text-finbud-green font-medium">🎉 Correct! Great job!</p>
                ) : (
                  <p className="text-finbud-coral font-medium">
                    Not quite! The correct answer was: {activeLesson.quiz_options[activeLesson.quiz_answer!]}
                  </p>
                )}
                <Button onClick={handleNextLesson} className="w-full" variant="soft">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No quiz - just complete */}
        {!activeLesson.quiz_question && (
          <Button onClick={handleNextLesson} className="w-full" variant="hero">
            Complete & Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    );
  }

  // Selected Module View
  if (selectedModule) {
    const progress = getModuleProgress(selectedModule.id);
    const ModuleIcon = iconMap[selectedModule.icon] || BookOpen;
    
    return (
      <div className="space-y-6 pb-24">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedModuleId(null)}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>
        
        {/* Module Header */}
        <div className={cn("rounded-3xl p-6", selectedModule.bgColor)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-finbud">
              <ModuleIcon className={cn("w-8 h-8", selectedModule.color)} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedModule.title}</h1>
              <p className="text-muted-foreground">{selectedModule.description}</p>
            </div>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">{progress.percentage}% complete ({progress.completed}/{progress.total})</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {moduleLessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const locked = isLessonLocked(lesson.id, lesson.module_id);
            const points = 25 + (lesson.order_index * 5);
            
            return (
              <div 
                key={lesson.id}
                onClick={() => !locked && handleStartLesson(lesson.id)}
                className={cn(
                  "bg-card rounded-2xl p-4 shadow-sm transition-all animate-slide-up",
                  locked ? "opacity-60 cursor-not-allowed" : "hover:shadow-finbud cursor-pointer"
                )}
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    completed 
                      ? "bg-finbud-green-light" 
                      : locked 
                        ? "bg-muted" 
                        : selectedModule.bgColor
                  )}>
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6 text-finbud-green" />
                    ) : locked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <BookOpen className={cn("w-5 h-5", selectedModule.color)} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        5 min
                      </span>
                      <span className="flex items-center gap-1 text-xs text-finbud-gold">
                        <Star className="w-3 h-3" />
                        +{points} pts
                      </span>
                    </div>
                  </div>
                  
                  {!locked && !completed && (
                    <Button variant="soft" size="sm" className="rounded-xl">
                      Start
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Main Modules View
  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <div className="h-32 bg-muted rounded-3xl animate-pulse" />
        <div className="h-20 bg-muted rounded-3xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-3xl animate-pulse" />
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
              <p className="text-sm text-muted-foreground">{totalCompletedLessons} of {totalLessons} lessons completed</p>
            </div>
          </div>
        </div>
        
        <Progress value={totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0} className="h-3" />
      </div>

      {/* Daily Challenge */}
      <div 
        className="bg-finbud-gold-light rounded-3xl p-5 animate-slide-up cursor-pointer hover:shadow-finbud transition-shadow" 
        style={{ animationDelay: "0.1s" }}
        onClick={handleDailyChallenge}
      >
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
          const Icon = iconMap[module.icon] || BookOpen;
          const progress = getModuleProgress(module.id);
          
          return (
            <div 
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
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
                    <Progress value={progress.percentage} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {progress.completed}/{progress.total}
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
