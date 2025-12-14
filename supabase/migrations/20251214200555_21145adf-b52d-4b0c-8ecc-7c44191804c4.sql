-- Add avatar_choice column to profiles for custom avatars
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_choice TEXT DEFAULT NULL;

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create badges table
CREATE TABLE public.badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    unlock_criteria TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general'
);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, unlock_criteria, category) VALUES
    ('Starter', 'Complete your first lesson', 'star', 'Complete 1 lesson', 'learning'),
    ('Saver Pro', 'Save $100 towards any goal', 'target', 'Accumulate $100 in savings', 'savings'),
    ('Quick Learner', 'Complete 5 lessons', 'zap', 'Complete 5 lessons', 'learning'),
    ('5 Day Streak', 'Maintain a 5 day learning streak', 'flame', 'Login 5 consecutive days', 'streak'),
    ('Budget Ninja', 'Stay under budget for a full month', 'medal', 'Stay under budget for 30 days', 'budgeting'),
    ('Savings Champ', 'Reach your first savings goal', 'trophy', 'Complete 1 savings goal', 'savings'),
    ('Finance Scholar', 'Complete all lessons in a module', 'graduation-cap', 'Complete 1 full module', 'learning'),
    ('Money Master', 'Track 50 transactions', 'wallet', 'Log 50 transactions', 'budgeting');

-- Create user_badges table for earned badges
CREATE TABLE public.user_badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    badge_id UUID NOT NULL REFERENCES public.badges(id),
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_badges
CREATE POLICY "Users can view own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow anyone to read badge definitions
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- Create lesson_content table for actual course content
CREATE TABLE public.lesson_content (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    quiz_question TEXT,
    quiz_options JSONB,
    quiz_answer INTEGER,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS and allow public read
ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lesson content" ON public.lesson_content FOR SELECT USING (true);

-- Insert actual finance course content
INSERT INTO public.lesson_content (id, module_id, title, content, quiz_question, quiz_options, quiz_answer, order_index) VALUES
-- Budgeting Basics Module
('1', 'budgeting', 'What is a Budget?', 
E'# What is a Budget?\n\nA budget is simply a plan for your money. It tells each dollar where to go before you spend it.\n\n## Why Budget?\n\n- **Control**: Know exactly where your money goes\n- **Goals**: Save for things that matter to you\n- **Freedom**: Spend guilt-free on what you''ve planned for\n- **Security**: Build an emergency fund for surprises\n\n## The Simple Truth\n\nMoney In - Money Out = What''s Left\n\nIf you spend more than you earn, you go into debt. If you spend less, you build wealth. A budget helps you spend less than you earn.\n\n## Getting Started\n\n1. Track your income (paychecks, allowance, side gigs)\n2. List your expenses (rent, food, subscriptions)\n3. Subtract expenses from income\n4. Adjust until the math works!',
'What is the main purpose of a budget?', 
'["To restrict all spending", "To plan where your money goes", "To save every penny", "To track only big purchases"]', 
1, 1),

('2', 'budgeting', 'The 50/30/20 Rule', 
E'# The 50/30/20 Rule\n\nThis popular budgeting method divides your after-tax income into three categories:\n\n## 50% - Needs\n\nEssential expenses you can''t avoid:\n- Rent/housing\n- Utilities\n- Groceries\n- Transportation\n- Minimum debt payments\n- Insurance\n\n## 30% - Wants\n\nThings you enjoy but could live without:\n- Dining out\n- Entertainment (Netflix, games)\n- Shopping for non-essentials\n- Hobbies\n- Vacations\n\n## 20% - Savings & Debt\n\nBuilding your future:\n- Emergency fund\n- Retirement savings\n- Extra debt payments\n- Investments\n\n## Example\n\nIf you earn $2,000/month:\n- Needs: $1,000 (50%)\n- Wants: $600 (30%)\n- Savings: $400 (20%)',
'In the 50/30/20 rule, what percentage goes to wants?',
'["50%", "30%", "20%", "40%"]',
1, 2),

('3', 'budgeting', 'Tracking Expenses', 
E'# Tracking Your Expenses\n\nYou can''t manage what you don''t measure. Tracking expenses reveals where your money actually goes.\n\n## Methods to Track\n\n### 1. Apps (Like This One!)\n- Automatic categorization\n- Visual charts and graphs\n- Real-time balance updates\n\n### 2. Spreadsheets\n- Full control over categories\n- Free (Google Sheets)\n- Customizable\n\n### 3. Pen and Paper\n- No technology needed\n- Forces you to be intentional\n- Tactile awareness\n\n## What to Track\n\nEVERYTHING! Even small purchases add up:\n- That $5 coffee = $150/month\n- $10 lunch = $300/month\n- Subscriptions you forgot about\n\n## The Latte Factor\n\nSmall daily expenses seem harmless but compound:\n- $5/day = $1,825/year\n- Invested over 30 years = $150,000+\n\nNot saying never buy coffee - just be aware!',
'Why is tracking small expenses important?',
'["Only big purchases matter", "Small expenses add up significantly over time", "It''s not important", "Only for tax purposes"]',
1, 3),

('4', 'budgeting', 'Emergency Funds', 
E'# Building Your Emergency Fund\n\nAn emergency fund is money set aside for unexpected expenses or income loss.\n\n## Why You Need One\n\n- Car breaks down\n- Medical emergency\n- Job loss\n- Unexpected travel\n\nWithout an emergency fund, you''ll rely on credit cards or loans, creating debt.\n\n## How Much to Save\n\n### Starter Goal\n$1,000 - covers most minor emergencies\n\n### Full Emergency Fund\n3-6 months of expenses\n- If you earn $2,000/month, aim for $6,000-$12,000\n\n## Where to Keep It\n\n- High-yield savings account (earns interest!)\n- Separate from checking (harder to spend)\n- Easy to access (not locked in investments)\n\n## Building It Up\n\n1. Start with $50-100/month\n2. Automate transfers\n3. Use windfalls (tax refunds, gifts)\n4. Sell unused items\n\nRemember: This is for EMERGENCIES only, not wants!',
'What is the recommended starter emergency fund amount?',
'["$500", "$1,000", "$5,000", "$10,000"]',
1, 4),

-- Credit Score Module
('5', 'credit', 'What is a Credit Score?', 
E'# Understanding Credit Scores\n\nA credit score is a 3-digit number (300-850) that represents how trustworthy you are with borrowed money.\n\n## Score Ranges\n\n- **800-850**: Exceptional\n- **740-799**: Very Good\n- **670-739**: Good\n- **580-669**: Fair\n- **300-579**: Poor\n\n## What Affects Your Score\n\n1. **Payment History (35%)** - Pay on time!\n2. **Credit Utilization (30%)** - How much you use\n3. **Length of History (15%)** - Older is better\n4. **Credit Mix (10%)** - Variety of accounts\n5. **New Credit (10%)** - Don''t apply too often\n\n## Why It Matters\n\n- Loan approval and interest rates\n- Apartment applications\n- Some job applications\n- Insurance rates\n- Cell phone plans\n\nA good score saves you thousands over your lifetime!',
'What is the largest factor affecting your credit score?',
'["Length of credit history", "Credit mix", "Payment history", "New credit inquiries"]',
2, 1),

('6', 'credit', 'Credit Utilization', 
E'# Credit Utilization Explained\n\nCredit utilization is the percentage of your available credit that you''re using.\n\n## The Formula\n\nUtilization = (Balance ÷ Credit Limit) × 100\n\n### Example\n- Credit limit: $1,000\n- Current balance: $300\n- Utilization: 30%\n\n## The Magic Number\n\n**Keep utilization under 30%**\n- Under 10% is even better\n- 0% doesn''t help as much (shows no activity)\n\n## Why It Matters\n\nHigh utilization = looks risky to lenders\n- \"They''re using all their credit!\"\n- \"Can they handle more debt?\"\n\n## Tips to Lower It\n\n1. Pay off balances before statement closes\n2. Request credit limit increases\n3. Spread spending across cards\n4. Pay multiple times per month\n\n## The Reset\n\nGood news: utilization has no memory!\n- Pay down balance today\n- Score improves next month',
'What is the recommended maximum credit utilization?',
'["50%", "30%", "75%", "100%"]',
1, 2),

('7', 'credit', 'Building Credit History', 
E'# Building Your Credit History\n\nNo credit is almost as challenging as bad credit. Here''s how to build from scratch.\n\n## Starter Options\n\n### 1. Secured Credit Card\n- Deposit $200-500 as collateral\n- Use it like a regular card\n- Gets reported to credit bureaus\n\n### 2. Become an Authorized User\n- Get added to parent''s card\n- Their good history helps you\n- You don''t need to use it\n\n### 3. Credit Builder Loans\n- Bank holds money in savings\n- You make payments\n- Money released after paid off\n\n### 4. Student Credit Cards\n- Designed for first-time users\n- Lower limits, easier approval\n\n## Golden Rules\n\n1. Always pay on time (set autopay!)\n2. Keep utilization low\n3. Don''t close old accounts\n4. Only apply when needed\n5. Check your credit report yearly\n\n## Timeline\n\n- 6 months: Score appears\n- 1-2 years: Build solid history\n- 3+ years: Qualify for best rates',
'What is a secured credit card?',
'["A card with extra security features", "A card requiring a deposit as collateral", "A card only for online use", "A card with no spending limit"]',
1, 3),

-- Saving Strategies Module
('8', 'saving', 'Pay Yourself First', 
E'# Pay Yourself First\n\nThis powerful principle means saving BEFORE you spend on anything else.\n\n## The Traditional Way (Wrong)\n\nIncome → Bills → Spending → Save what''s left\n\nProblem: There''s rarely anything left!\n\n## Pay Yourself First (Right)\n\nIncome → Savings → Bills → Spending\n\nYou treat savings like a required bill.\n\n## How to Do It\n\n### 1. Automate\n- Set up automatic transfers\n- Schedule for payday\n- Out of sight, out of mind\n\n### 2. Start Small\n- Even $25/paycheck works\n- Increase by 1% each raise\n- Build the habit first\n\n### 3. Use Separate Accounts\n- Checking for spending\n- Savings for goals\n- Makes it harder to spend\n\n## The Math\n\nSaving $100/month for 40 years at 7% return:\n= **$264,000**\n\nThat''s the power of paying yourself first!',
'What does "Pay Yourself First" mean?',
'["Pay your bills first", "Save before spending on anything else", "Get paid before others", "Pay off debt first"]',
1, 1),

('9', 'saving', 'High-Yield Savings', 
E'# High-Yield Savings Accounts\n\nNot all savings accounts are created equal. High-yield accounts earn significantly more interest.\n\n## The Difference\n\n### Traditional Banks\n- Average APY: 0.01-0.05%\n- $10,000 earns: $1-5/year\n\n### High-Yield Online Banks\n- Average APY: 4-5%\n- $10,000 earns: $400-500/year\n\nThat''s 100x more!\n\n## Why Online Banks Pay More\n\n- No physical branches to maintain\n- Lower overhead costs\n- Pass savings to customers\n\n## What to Look For\n\n1. **APY** (Annual Percentage Yield)\n2. No monthly fees\n3. No minimum balance\n4. FDIC insured (up to $250,000)\n5. Easy transfers to checking\n\n## Popular Options\n\n- Marcus by Goldman Sachs\n- Ally Bank\n- Discover Savings\n- Capital One 360\n\n## Best Uses\n\n- Emergency fund\n- Short-term savings goals\n- Money you''ll need within 1-2 years',
'What is the main advantage of high-yield savings accounts?',
'["Better mobile apps", "Higher interest rates", "More branch locations", "Lower deposit requirements"]',
1, 2),

-- Investing Module
('10', 'investing', 'What are Stocks?', 
E'# Introduction to Stocks\n\nA stock represents ownership in a company. When you buy stock, you own a tiny piece of that business.\n\n## How It Works\n\n1. Company needs money to grow\n2. They sell ownership shares\n3. You buy shares = you''re a part owner\n4. Company profits = your shares may increase in value\n\n## Making Money\n\n### Price Appreciation\n- Buy low, sell high\n- Stock price rises over time\n- Example: Buy at $50, sell at $100 = $50 profit\n\n### Dividends\n- Company shares profits with owners\n- Usually quarterly payments\n- Can reinvest or spend\n\n## The Risks\n\n- Prices go down too\n- Companies can fail\n- Short-term volatility\n- No guaranteed returns\n\n## Key Terms\n\n- **Share**: One unit of ownership\n- **Portfolio**: Collection of investments\n- **Dividend**: Profit sharing payment\n- **Market Cap**: Total company value\n\n## Getting Started\n\nStart with index funds (next lesson!) before picking individual stocks.',
'What does owning a stock mean?',
'["Lending money to a company", "Owning a small piece of a company", "Buying company products at a discount", "Working for the company"]',
1, 1),

('11', 'investing', 'Index Funds', 
E'# Index Funds Explained\n\nIndex funds are the ultimate "set it and forget it" investment. They''re perfect for beginners.\n\n## What Is an Index?\n\nAn index tracks a group of stocks:\n- **S&P 500**: 500 largest US companies\n- **Total Market**: All US stocks\n- **International**: Non-US companies\n\n## What Is an Index Fund?\n\nA fund that owns ALL stocks in an index:\n- Buy one fund = own hundreds of companies\n- Automatic diversification\n- Low fees\n\n## Why Index Funds Win\n\n### 1. Diversification\n- Don''t put eggs in one basket\n- One company fails? Others balance it out\n\n### 2. Low Costs\n- Expense ratios: 0.03-0.20%\n- Actively managed funds: 1-2%\n- Saves thousands over time\n\n### 3. Performance\n- Beat 90% of professional managers\n- Long-term average: ~10%/year\n\n## Popular Index Funds\n\n- VTI (Vanguard Total Stock Market)\n- SPY (S&P 500)\n- FXAIX (Fidelity 500 Index)\n\n## Start Here\n\n1. Open a Roth IRA or brokerage account\n2. Buy a total market index fund\n3. Invest regularly\n4. Don''t check daily!',
'What is the main advantage of index funds?',
'["Guaranteed high returns", "Automatic diversification with low fees", "No risk of loss", "Quick profits"]',
1, 2);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;