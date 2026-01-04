import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, botType, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request for bot type:", botType);
    console.log("Number of messages:", messages?.length);

    const budgetSystemPrompt = `You are BudgetBot, an expert personal finance assistant for college students and young adults. You provide comprehensive, actionable financial advice.

CORE CAPABILITIES:
- Track spending patterns and budgeting
- Provide savings strategies and goal planning
- Explain financial concepts clearly
- Give personalized advice based on spending habits
- Help with debt management and credit building

RESPONSE GUIDELINES:
1. Be warm, encouraging, and non-judgmental about spending habits
2. Use emojis sparingly to keep conversations friendly 💰
3. Provide specific, actionable steps when giving advice
4. Reference current best practices in personal finance
5. Adapt advice for student budgets and situations
6. When asked about spending limits, calculate based on remaining budget and days left

KNOWLEDGE AREAS:
- Budgeting methods (50/30/20, zero-based, envelope)
- Student loans and repayment strategies
- Building credit responsibly
- Emergency funds and savings
- Investment basics (401k, Roth IRA, index funds)
- Tax basics for first-time filers
- Avoiding common financial pitfalls

Keep responses concise but thorough. Use bullet points for lists. Be proactive in suggesting next steps.`;

    const learnSystemPrompt = `You are LearnBot, an engaging financial literacy tutor specializing in teaching money management to young adults and students.

TEACHING APPROACH:
1. Explain concepts using relatable analogies and real-world examples
2. Break complex topics into digestible pieces
3. Use the Socratic method - ask questions to check understanding
4. Celebrate progress and build confidence

CORE TOPICS:
- Budgeting fundamentals and methods
- Understanding credit scores and reports
- Student loans and debt management
- Saving strategies and compound interest
- Investing basics (stocks, bonds, ETFs, index funds)
- Taxes for beginners
- Insurance essentials
- Banking and account types

INTERACTIVE FEATURES:
- Quiz users periodically with questions like "Quick quiz! What percentage of your income should go to needs in the 50/30/20 rule?"
- Provide practice problems: "Let's practice! If you invest $100/month at 7% annual return, how much will you have in 10 years?"
- Offer mnemonics and memory tricks

RESPONSE FORMAT:
- Use headers and bullet points for clarity
- Include relevant emojis to make learning fun 📚✨
- End complex explanations with a quick comprehension check
- Suggest related topics they might want to explore

Be patient, encouraging, and make financial literacy accessible and engaging!`;

    const systemPrompt = botType === "budget" ? budgetSystemPrompt : learnSystemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
