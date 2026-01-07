import { GoogleGenerativeAI } from "@google/generative-ai";
import { FinancialData, AIProvider } from "../types";
import { INDUSTRY_BENCHMARKS, calculateKPIs } from '../constants';

const PROXY_URL = (import.meta as any).env.VITE_PROXY_URL || '';

/**
 * Standard error handler for AI services.
 */
const handleApiError = (error: any, provider: AIProvider): string => {
    console.error(`${provider} API Error:`, error);

    const msg = error.message?.toLowerCase() || '';

    if (msg.includes('401') || msg.includes('api key') || msg.includes('invalid') || msg.includes('unauthorized')) {
        return `🛑 ${provider.toUpperCase()} Auth Error: Your API key appears to be invalid or expired. Please update it in the Settings page to restore service.`;
    }

    if (msg.includes('429') || msg.includes('quota') || msg.includes('limit') || msg.includes('exhausted')) {
        return `⚠️ ${provider.toUpperCase()} Quota Limit: Your current API quota has been reached. Try switching to the other AI provider in Settings or upgrade your API plan with ${provider === 'gemini' ? 'Google' : 'OpenAI'}.`;
    }

    if (msg.includes('timeout') || msg.includes('deadline') || msg.includes('connection')) {
        return `📡 Connection Issue: The Noble AI is having trouble reaching ${provider === 'gemini' ? 'Google' : 'OpenAI'} servers. Please check your internet connection and try again in a few moments.`;
    }

    if (msg.includes('500') || msg.includes('internal server error')) {
        return `🛠️ Server Error: The ${provider.toUpperCase()} service is currently experiencing internal issues. Switching providers in Settings might resolve this.`;
    }

    return `The Noble World AI encountered a temporary issue: "${error.message || 'Unknown Error'}". Please verify your configuration in Settings or try a different AI provider.`;
};

async function callOpenAI(prompt: string, systemInstruction: string, apiKey: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
    if (PROXY_URL) {
        // Normalize Proxy URL: remove trailing slash if exists
        const root = PROXY_URL.endsWith('/') ? PROXY_URL.slice(0, -1) : PROXY_URL;
        const targetUrl = `${root}/openai`;

        console.log("🚀 AI Proxy Handshake:", targetUrl);

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemInstruction, apiKey, history })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("❌ Non-JSON Response received:", text.substring(0, 100));
                throw new Error(`Proxy error: Received ${response.status} (${response.statusText}). The server is responding with HTML instead of API data. This usually happens if the backend isn't mapped correctly to ${targetUrl}.`);
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Proxy call failed with status ${response.status}`);
            return data.content;
        } catch (fetchErr: any) {
            if (fetchErr.message.includes('Failed to fetch')) {
                throw new Error(`Network Error: Cannot reach the backend at ${targetUrl}. Is the Node.js server running and reachable?`);
            }
            throw fetchErr;
        }
    }

    const messages = [
        { role: "system", content: systemInstruction },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4-turbo-preview",
            messages,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'OpenAI API call failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGemini(prompt: string, systemInstruction: string, apiKey: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
    if (PROXY_URL) {
        // Normalize Proxy URL: remove trailing slash if exists
        const root = PROXY_URL.endsWith('/') ? PROXY_URL.slice(0, -1) : PROXY_URL;
        const targetUrl = `${root}/gemini`;

        console.log("🚀 AI Proxy Handshake:", targetUrl);

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemInstruction, apiKey, history })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("❌ Non-JSON Response received:", text.substring(0, 100));
                throw new Error(`Proxy error: Received ${response.status} (${response.statusText}). The server is responding with HTML instead of API data. This usually happens if the backend isn't mapped correctly to ${targetUrl}.`);
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Proxy call failed with status ${response.status}`);
            return data.content;
        } catch (fetchErr: any) {
            if (fetchErr.message.includes('Failed to fetch')) {
                throw new Error(`Network Error: Cannot reach the backend at ${targetUrl}. Is the Node.js server running and reachable?`);
            }
            throw fetchErr;
        }
    }

    const genAI = new GoogleGenerativeAI(apiKey || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Generates strategic financial analysis.
 */
export async function getFinancialInsights(
    data: FinancialData,
    question?: string,
    keys?: { google: string; openai: string },
    provider: AIProvider = 'gemini',
    history: { role: 'user' | 'assistant', content: string }[] = []
) {
    const userKey = provider === 'gemini' ? keys?.google : keys?.openai;
    const systemKey = provider === 'gemini' ? (import.meta as any).env.VITE_GOOGLE_AI_KEY : (import.meta as any).env.VITE_OPENAI_API_KEY;
    const apiKey = userKey || systemKey;

    const otherProvider = provider === 'gemini' ? 'OpenAI' : 'Gemini';
    const hasOtherKey = provider === 'gemini' ? !!keys?.openai : !!keys?.google;

    if (!apiKey && !PROXY_URL) {
        return `⚠️ ${provider.toUpperCase()} Key missing. Please configure it in Settings.${hasOtherKey ? ` Alternatively, you can switch your Preferred Provider to ${otherProvider}.` : ''}`;
    }

    const industry = data.industry || 'Technology';
    const benchmarks = INDUSTRY_BENCHMARKS[industry];
    const benchmarkText = benchmarks
        ? `Industry benchmarks for ${industry}: Net Profit Margin: ${benchmarks.netProfitMargin}%, Current Ratio: ${benchmarks.currentRatio}, Debt-to-Equity: ${benchmarks.debtToEquity}%.`
        : 'No industry benchmarks available.';

    const systemInstruction = `
    You are the "Noble World AI Financial Coach". Tone: Professional, expert, strategic.
    ${benchmarkText}
    
    Data: Revenue $${data.revenue}, COGS $${data.cogs}, OpEx $${data.operatingExpenses}, Net Profit $${data.revenue - (data.cogs + data.operatingExpenses)}, Current Ratio ${(data.currentAssets / data.currentLiabilities).toFixed(2)}.
    
    Format: Use Markdown. If analyzing, include ### Strengths, ### Weaknesses, and ### Recommendations.
  `;

    try {
        const prompt = question || "Please provide a strategic analysis of my current business health.";
        return provider === 'gemini'
            ? await callGemini(prompt, systemInstruction, apiKey || '', history)
            : await callOpenAI(prompt, systemInstruction, apiKey || '', history);
    } catch (error) {
        return handleApiError(error, provider);
    }
}

/**
 * Generates dynamic financial goal suggestions.
 */
export async function getGoalSuggestion(
    data: FinancialData,
    keys?: { google: string; openai: string },
    provider: AIProvider = 'gemini'
) {
    const userKey = provider === 'gemini' ? keys?.google : keys?.openai;
    const systemKey = provider === 'gemini' ? (import.meta as any).env.VITE_GOOGLE_AI_KEY : (import.meta as any).env.VITE_OPENAI_API_KEY;
    const apiKey = userKey || systemKey;

    if (!apiKey && !PROXY_URL) return null;

    const industry = data.industry || 'Technology';
    const benchmarks = INDUSTRY_BENCHMARKS[industry];
    const kpis = calculateKPIs(data);

    const systemInstruction = `You are the Noble AI Strategic Architect. Analyze the provided financial data and suggest ONE high-impact goal. Return ONLY a JSON object with: { "name": string, "metric": "revenue"|"netProfit"|"netMargin"|"currentAssets"|"leadsGenerated", "targetValue": number, "reasoning": string }. Base the targetValue on a 5-15% improvement over current metrics or alignment with benchmarks.`;

    const prompt = `Industry: ${industry}. Revenue: $${data.revenue}. Net Margin: ${kpis.netProfitMargin}%. Benchmarks: Margin ${benchmarks?.netProfitMargin}%. Provide a suggestion.`;

    try {
        const result = provider === 'gemini'
            ? await callGemini(prompt, systemInstruction, apiKey || '')
            : await callOpenAI(prompt, systemInstruction, apiKey || '');

        // Attempt to parse JSON from AI response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error("Goal Suggestion Error:", error);
        return null;
    }
}

/**
 * Generates marketing-specific insights.
 */
export async function getMarketingInsights(
    data: FinancialData,
    keys?: { google: string; openai: string },
    provider: AIProvider = 'gemini'
) {
    const userKey = provider === 'gemini' ? keys?.google : keys?.openai;
    const systemKey = provider === 'gemini' ? (import.meta as any).env.VITE_GOOGLE_AI_KEY : (import.meta as any).env.VITE_OPENAI_API_KEY;
    const apiKey = userKey || systemKey;

    if (!apiKey && !PROXY_URL) return `⚠️ ${provider.toUpperCase()} Key missing.`;

    const systemInstruction = `You are the Noble World Marketing Strategist. Analyze marketing ROI and provide 3 actionable growth tips for a ${data.industry} business.`;
    const prompt = `Spend: $${data.marketingSpend}, Leads: ${data.leadsGenerated}, Conv: ${data.conversions}. Generate strategy.`;

    try {
        return provider === 'gemini'
            ? await callGemini(prompt, systemInstruction, apiKey || '')
            : await callOpenAI(prompt, systemInstruction, apiKey || '');
    } catch (error) {
        return handleApiError(error, provider);
    }
}

/**
 * Text-to-Speech generation using Gemini.
 */
export async function generateSpeech(text: string, apiKey?: string): Promise<string | null> {
    const finalKey = apiKey || (import.meta as any).env.VITE_GOOGLE_AI_KEY;

    if (!finalKey && !PROXY_URL) {
        console.error("TTS Error: No API Key found.");
        return null;
    }

    try {
        if (PROXY_URL) {
            const response = await fetch(`${PROXY_URL}/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, apiKey })
            });
            const data = await response.json();
            return data.audio || null;
        }

        const ai = new GoogleGenerativeAI(apiKey || '');
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: text }] }],
            generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        } as any);

        return response.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
        console.error("Gemini TTS Error:", error);
        return null;
    }
}
