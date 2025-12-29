import { GoogleGenerativeAI } from "@google/generative-ai";
import { FinancialData, AIProvider } from "../types";
import { INDUSTRY_BENCHMARKS } from '../constants';

const PROXY_URL = (import.meta as any).env.VITE_PROXY_URL || '';

/**
 * Standard error handler for AI services.
 */
const handleApiError = (error: any, provider: AIProvider): string => {
    console.error(`${provider} API Error:`, error);
    if (error.message?.includes('401') || error.message?.includes('API key') || error.message?.includes('INVALID')) {
        return `🛑 ${provider.toUpperCase()} Error: Invalid or expired API Key. Please verify your credentials in Settings.`;
    }
    return `The Noble World AI encountered a temporary connection issue. Please verify your internet connection or try switching AI providers in Settings.`;
};

async function callOpenAI(prompt: string, systemInstruction: string, apiKey: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
    if (PROXY_URL) {
        const response = await fetch(`${PROXY_URL}/openai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction, apiKey, history })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Proxy call failed');
        return data.content;
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
        const response = await fetch(`${PROXY_URL}/gemini`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction, apiKey, history })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Proxy call failed');
        return data.content;
    }

    const genAI = new GoogleGenerativeAI(apiKey || '');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
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
    const apiKey = provider === 'gemini' ? keys?.google : keys?.openai;
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
 * Generates marketing-specific insights.
 */
export async function getMarketingInsights(
    data: FinancialData,
    keys?: { google: string; openai: string },
    provider: AIProvider = 'gemini'
) {
    const apiKey = provider === 'gemini' ? keys?.google : keys?.openai;
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
    if (!apiKey && !PROXY_URL) {
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
            model: "gemini-2.0-flash-exp",
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
