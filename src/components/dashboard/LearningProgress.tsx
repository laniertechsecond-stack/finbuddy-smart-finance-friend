import { BookOpen, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LearningProgressProps {
  completedLessons: number;
  totalLessons: number;
  nextLesson: string;
  onStartLesson: () => void;
}

export function LearningProgress({ 
  completedLessons, 
  totalLessons, 
  nextLesson,
  onStartLesson 
}: LearningProgressProps) {
  const progressPercent = (completedLessons / totalLessons) * 100;
  
  return (
    <div className="bg-card rounded-3xl p-6 shadow-finbud animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-finbud-purple-light flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-finbud-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Learning Journey</h3>
            <p className="text-sm text-muted-foreground">{completedLessons} of {totalLessons} lessons</p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-finbud-purple rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      {/* Next Lesson Card */}
      <div 
        className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
        onClick={onStartLesson}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
            <Star className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Up next</p>
            <h4 className="font-medium text-foreground">{nextLesson}</h4>
          </div>
        </div>
        <Button variant="soft" size="sm" className="rounded-xl">
          Start
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
