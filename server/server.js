import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchconsole } from '@googleapis/searchconsole';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

log('🚀 Noble Pathfinder Pro: Initializing Full Feature Suite...');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const NOBLE_VERSION = '2.4.0-PATHFINDER-PRO';

// --- 🔐 GOOGLE AUTH SETUP ---
const GOOGLE_AUTH_PATH = path.join(__dirname, 'google-service-account.json');
let gscClient = null;
let ga4Client = null;
let authClient = null;

try {
    if (fs.existsSync(GOOGLE_AUTH_PATH)) {
        gscClient = searchconsole('v1');
        ga4Client = new BetaAnalyticsDataClient({ keyFilename: GOOGLE_AUTH_PATH });
        authClient = new GoogleAuth({
            keyFile: GOOGLE_AUTH_PATH,
            scopes: [
                'https://www.googleapis.com/auth/webmasters.readonly',
                'https://www.googleapis.com/auth/analytics.readonly'
            ],
        });
        log('✅ GOOGLE: Services initialized.');
    }
} catch (error) {
    log(`❌ GOOGLE ERROR: ${error.message}`);
}

// --- 🎯 THE "PATHFINDER" ROUTING ENGINE ---
// Detects keywords anywhere in the path to bypass cPanel/Apache renaming
app.use(async (req, res, next) => {
    const p = req.path.toLowerCase();

    // 1. Diagnostics
    if (p.includes('system-status') || p.includes('health')) {
        return res.json({
            status: 'online',
            received_path: req.path,
            version: NOBLE_VERSION,
            smtp: !!process.env.EMAIL_HOST,
            ai: !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY),
            google_auth: !!authClient
        });
    }

    // 2. Gemini AI / Coach
    if (p.includes('gemini')) {
        return handleGemini(req, res);
    }

    // 3. Text to Speech (TTS)
    if (p.includes('tts')) {
        return handleTTS(req, res);
    }

    // 4. Email Blast
    if (p.includes('blast-email')) {
        return handleEmail(req, res);
    }

    // 5. SEO Analytics
    if (p.includes('seo-analytics')) {
        return handleSEO(req, res);
    }

    // 6. Revenue Intelligence
    if (p.includes('revenue-intelligence')) {
        return handleRevenue(req, res);
    }

    // 7. Root
    if (p === '/' || p === '' || p.includes('index.js')) {
        return res.send(`Noble Engine ${NOBLE_VERSION} - Online. Ready for commands.`);
    }

    next();
});

// --- 🤖 AI HANDLER ---
async function handleGemini(req, res) {
    const { prompt, systemInstruction } = req.body;
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY;
    if (!key) return res.status(400).json({ error: 'AI Key Missing' });
    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: (systemInstruction || "") + "\n\nUser: " + prompt }] }]
        });
        res.json({ content: result.response.text() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// --- 🗣️ TTS HANDLER ---
async function handleTTS(req, res) {
    const { text } = req.body;
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY;
    if (!key) return res.status(400).json({ error: 'AI Key Missing' });
    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: text }] }],
            generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
        });
        res.json({ audio: result.response.candidates[0].content.parts[0].inlineData.data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// --- 📊 SEO HANDLER ---
async function handleSEO(req, res) {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_I;
    if (!authClient) return res.status(503).json({ error: 'SEO Auth Missing' });
    try {
        const client = await authClient.getClient();
        const gscResponse = await gscClient.searchanalytics.query({
            siteUrl: 'https://clarity.noblesworld.com.ng',
            requestBody: {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                rowLimit: 10
            },
            auth: client
        });
        res.json({ searchConsole: gscResponse.data, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// --- 💰 REVENUE HANDLER ---
async function handleRevenue(req, res) {
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;
    try {
        const psRes = await fetch('https://api.paystack.co/transaction', { headers: { Authorization: `Bearer ${paystackKey}` } });
        const psData = await psRes.json();
        res.json({ status: 'success', data: psData.data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// --- 📧 EMAIL HANDLER ---
async function handleEmail(req, res) {
    const { recipients, subject, html } = req.body;
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'localhost',
        port: 465, secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: { rejectUnauthorized: false }
    });
    try {
        for (const email of recipients) {
            await transporter.sendMail({ from: `"Noble Clarity" <${process.env.EMAIL_USER}>`, to: email, subject, html });
        }
        res.json({ success: true, count: recipients.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

app.listen(PORT, () => log(`✅ Noble Pathfinder Pro Live on Port ${PORT}`));
