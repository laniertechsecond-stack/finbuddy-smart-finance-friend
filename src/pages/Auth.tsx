import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wallet, BookOpen, Sparkles, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        toast.error(emailResult.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        toast.error(passwordResult.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! You can now start using FinBud.');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo & Branding */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="w-20 h-20 gradient-hero rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Wallet className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">FinBud</h1>
        <p className="text-muted-foreground mt-2">Your personal finance buddy</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-finbud animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium transition-all",
              isLogin 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={cn(
              "flex-1 py-3 rounded-xl font-medium transition-all",
              !isLogin 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-2xl"
            variant="hero"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </Button>
        </form>

        {/* Features Preview */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-4">What you'll get:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-finbud-blue-light rounded-xl p-3">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Budget Tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-finbud-purple-light rounded-xl p-3">
              <BookOpen className="w-5 h-5 text-finbud-purple" />
              <span className="text-sm font-medium text-foreground">Finance Lessons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
