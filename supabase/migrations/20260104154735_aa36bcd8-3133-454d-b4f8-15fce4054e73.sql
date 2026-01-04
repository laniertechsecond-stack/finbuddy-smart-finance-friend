-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS monthly_income NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN DEFAULT false;