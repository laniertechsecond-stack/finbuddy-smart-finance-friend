import { useState, useCallback } from "react";
import { 
  Send, 
  Wallet, 
  BookOpen, 
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/chatStream";
import { toast } from "sonner";

type BotType = "budget" | "learn";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const suggestedPrompts = {
  budget: [
    "How much can I spend on food this week?",
    "Am I on track for my savings goal?",
    "What subscriptions can I cut?",
    "Create a plan to save $200 this month",
  ],
  learn: [
    "Explain credit scores like I'm 10",
    "What's compound interest?",
    "How do I start investing?",
    "Quiz me on budgeting basics",
  ],
};

const initialMessages: Record<BotType, Message[]> = {
  budget: [
    {
      id: "1",
      content: "Hey! 👋 I'm BudgetBot, your personal finance assistant. I can help you track spending, plan budgets, and reach your savings goals. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ],
  learn: [
    {
      id: "1",
      content: "Hi there! 📚 I'm LearnBot, your finance tutor. I can explain concepts, quiz you, and help you master money skills. What do you want to learn about today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ],
};

export function ChatView() {
  const [botType, setBotType] = useState<BotType>("budget");
  const [messages, setMessages] = useState<Message[]>(initialMessages[botType]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSwitchBot = (type: BotType) => {
    setBotType(type);
    setMessages(initialMessages[type]);
  };

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    let assistantContent = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id.startsWith("streaming-")) {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { 
          id: `streaming-${Date.now()}`, 
          content: assistantContent, 
          role: "assistant" as const, 
          timestamp: new Date() 
        }];
      });
    };

    // Convert messages to format expected by API
    const apiMessages = newMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    await streamChat({
      messages: apiMessages,
      botType,
      onDelta: upsertAssistant,
      onDone: () => setIsTyping(false),
      onError: (error) => {
        setIsTyping(false);
        toast.error(error);
      },
    });
  }, [messages, botType, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Bot Selector */}
      <div className="flex gap-3 p-1 bg-muted rounded-2xl mb-4">
        <button
          onClick={() => handleSwitchBot("budget")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200",
            botType === "budget"
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wallet className="w-5 h-5" />
          <span className="font-medium">BudgetBot</span>
        </button>
        <button
          onClick={() => handleSwitchBot("learn")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200",
            botType === "learn"
              ? "bg-card text-finbud-purple shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">LearnBot</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-slide-up",
              message.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                message.role === "user"
                  ? "bg-primary"
                  : botType === "budget"
                  ? "gradient-hero"
                  : "bg-finbud-purple"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Bot className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card shadow-sm rounded-tl-sm"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3 animate-slide-up">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                botType === "budget" ? "gradient-hero" : "bg-finbud-purple"
              )}
            >
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-muted-foreground px-1">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts[botType].slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="flex items-center gap-1 bg-muted hover:bg-muted/80 text-sm px-3 py-2 rounded-xl transition-colors"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="truncate max-w-[200px]">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder={`Ask ${botType === "budget" ? "BudgetBot" : "LearnBot"}...`}
          className="h-12 rounded-2xl border-2 focus:border-primary bg-card"
          disabled={isTyping}
        />
        <Button
          onClick={() => handleSend(input)}
          size="icon"
          className="h-12 w-12 rounded-2xl shrink-0"
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
