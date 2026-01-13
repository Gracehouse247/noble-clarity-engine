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
import { createServer } from 'http';
import { Server } from 'socket.io';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

log('🚀 Noble Pathfinder Pro: Initializing Full Feature Suite...');

const app = express();
const httpServer = createServer(app);

// --- 🛡️ SECURITY & AUDIT SYSTEM ---
const auditLog = (action, details, userId = 'system') => {
    const entry = {
        timestamp: new Date().toISOString(),
        action,
        details,
        userId,
        ip: 'internal' // In production, capture req.ip
    };
    log(`[AUDIT] ${action} | User: ${userId} | ${JSON.stringify(details)}`);
    // In production, write this to a database or protected log file
};

// CORS Configuration - Enhanced for Mobile Support
const allowedOrigins = [
    'https://clarity.noblesworld.com.ng',
    'http://localhost:5173', // Local development
    'http://localhost:3000',
    // Mobile app support (capacitor/cordova)
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else if (origin.startsWith('http://10.') || origin.startsWith('http://192.168.')) {
            // Allow local network requests (for mobile development)
            callback(null, true);
        } else {
            callback(new Error('Unauthorized by CORS Policy'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'User-Agent'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increased limit for mobile uploads

// Add compression for mobile optimization
import compression from 'compression';
app.use(compression({
    filter: (req, res) => {
        // Compress all responses for mobile
        if (req.headers['user-agent']?.includes('Noble-Clarity-Mobile')) {
            return true;
        }
        return compression.filter(req, res);
    },
    level: 6, // Balanced compression
}));

// Rate Limiting - More generous for mobile
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
        // Higher limit for mobile apps
        if (req.headers['user-agent']?.includes('Noble-Clarity-Mobile')) {
            return 200; // Double the limit for mobile
        }
        return 100; // Standard limit for web
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path.includes('system-status') || req.path.includes('health');
    }
});

app.use('/api/', limiter); // Apply to all API routes


const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 3001;
const NOBLE_VERSION = '2.5.0-REALTIME-EDITION';

// --- 🔌 SOCKET.IO HANDLERS ---
io.on('connection', (socket) => {
    log(`🔌 New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        log(`🔌 Client disconnected: ${socket.id}`);
    });

    // Handle Streaming AI Request
    socket.on('ask_ai', async (data) => {
        const { prompt, systemInstruction, userId } = data;
        auditLog('AI_REQUEST_SOCKET', { promptSnippet: prompt?.substring(0, 50) }, userId);
        log(`🤖 AI Request from ${socket.id}: ${prompt.substring(0, 50)}...`);

        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY;
        if (!key) {
            socket.emit('ai_error', { message: 'AI Key Missing' });
            return;
        }

        try {
            const ai = new GoogleGenerativeAI(key);
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContentStream({
                contents: [{ role: 'user', parts: [{ text: (systemInstruction || "") + "\n\nUser: " + prompt }] }]
            });

            let fullResponse = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                socket.emit('ai_chunk', { text: chunkText });
            }

            socket.emit('ai_complete', { fullText: fullResponse });
        } catch (err) {
            log(`❌ AI Error: ${err.message}`);
            socket.emit('ai_error', { message: err.message });
        }
    });
});

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

    // 0. Primary Landing (for cPanel/Production checks)
    if (p === '/' || p === '') {
        return res.json({
            engine: 'Noble Pathfinder Pro',
            status: 'Operational',
            timestamp: new Date().toISOString(),
            ready: true
        });
    }

    // 1. Diagnostics - Enhanced for Mobile
    if (p.includes('system-status') || p.includes('health')) {
        const isMobile = req.headers['user-agent']?.includes('Noble-Clarity-Mobile');

        return res.json({
            status: 'online',
            received_path: req.path,
            version: NOBLE_VERSION,
            timestamp: new Date().toISOString(),
            platform: isMobile ? 'mobile' : 'web',
            features: {
                smtp: !!process.env.EMAIL_HOST,
                ai: !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY),
                tts: !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY),
                google_auth: !!authClient,
                realtime: true,
                compression: true,
            },
            mobile_optimizations: isMobile ? {
                compression_enabled: true,
                rate_limit: 200,
                timeout_extended: true,
            } : undefined,
            endpoints: {
                ai: '/api/gemini',
                tts: '/api/tts',
                goals: '/api/goals',
                profile: '/api/profile',
                dashboard: '/api/revenue-intelligence',
            }
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

    // 7. Mission Goals (CRUD)
    if (p.includes('goals')) {
        return handleGoals(req, res);
    }

    // 8. User Profile & Business Metadata
    if (p.includes('profile')) {
        return handleProfile(req, res);
    }

    // 9. Push Notification Registration
    if (p.includes('register-device')) {
        return handleRegisterDevice(req, res);
    }

    // 10. Third-Party Webhooks & Integrations
    if (p.includes('webhooks') || p.includes('callback')) {
        return handleWebhooks(req, res);
    }

    next();
});

// --- 📱 DEVICE REGISTRATION HANDLER ---
const DEVICES_PATH = path.join(__dirname, 'devices_storage.json');

const getStoredDevices = () => {
    if (!fs.existsSync(DEVICES_PATH)) return {};
    return JSON.parse(fs.readFileSync(DEVICES_PATH, 'utf8'));
};

const saveStoredDevices = (data) => {
    fs.writeFileSync(DEVICES_PATH, JSON.stringify(data, null, 2));
};

async function handleRegisterDevice(req, res) {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const { token, platform } = req.body;

    if (!token) return res.status(400).json({ error: 'FCM Token missing' });

    const devices = getStoredDevices();
    if (!devices[userId]) devices[userId] = [];

    // Avoid duplicates
    if (!devices[userId].find(d => d.token === token)) {
        devices[userId].push({ token, platform, timestamp: new Date().toISOString() });
        saveStoredDevices(devices);
    }

    auditLog('DEVICE_REGISTERED', { platform }, userId);
    res.json({ success: true, message: 'Device synced to Noble Cloud' });
}

// --- 🔗 WEBHOOKS & INTEGRATIONS HANDLER ---
async function handleWebhooks(req, res) {
    const path = req.path;
    const userId = req.query.userId || 'guest'; // OAuth usually sends state/userId in query

    auditLog('WEBHOOK_RECEIVED', { path }, userId);

    // Mock logic for Stripe/Plaid/Sheets handshakes
    if (path.includes('stripe')) {
        return res.json({ status: 'Stripe sync active', lastPulse: new Date().toISOString() });
    }

    if (path.includes('plaid')) {
        return res.json({ status: 'Financial pipeline connected', vault: 'Noble-Encrypted' });
    }

    if (path.includes('sheets')) {
        return res.json({ status: 'Google Sheets sync active', cellsMapped: 450 });
    }

    // Generic OAuth callback successful response
    res.send(`
        <html>
            <body style="background: #0F1116; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="text-align: center; border: 1px solid #1A1D23; padding: 40px; border-radius: 20px; background: #14161B;">
                    <h2 style="color: #007AFF;">Integration Successful</h2>
                    <p>Noble Clarity has successfully established a secure link.</p>
                    <p style="color: #666; font-size: 12px;">You can now close this window and return to the app.</p>
                </div>
            </body>
        </html>
    `);
}

// --- 🎯 PROFILE HANDLER ---
const PROFILES_PATH = path.join(__dirname, 'profiles_storage_v2.json');

const getStoredProfiles = () => {
    if (!fs.existsSync(PROFILES_PATH)) return {};
    return JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
};

const saveStoredProfiles = (data) => {
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(data, null, 2));
};

async function handleProfile(req, res) {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const method = req.method;
    const profiles = getStoredProfiles();

    auditLog(`PROFILE_${method}`, { path: req.path }, userId);

    if (method === 'GET') {
        return res.json(profiles[userId] || {
            name: 'Noble User',
            industry: 'SaaS',
            stage: 'Seed',
            targetMetric: 'Runway',
            businessSize: '1-10 Employees',
            currency: 'USD'
        });
    }

    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        profiles[userId] = { ...(profiles[userId] || {}), ...req.body.profile };
        saveStoredProfiles(profiles);
        return res.json(profiles[userId]);
    }

    res.status(405).json({ error: 'Method not allowed' });
}

// --- 🎯 GOALS HANDLER (CRUD) ---
const GOALS_PATH = path.join(__dirname, 'goals_storage.json');

// Helper to read/write goals
const getStoredGoals = () => {
    if (!fs.existsSync(GOALS_PATH)) return {};
    return JSON.parse(fs.readFileSync(GOALS_PATH, 'utf8'));
};

const saveStoredGoals = (data) => {
    fs.writeFileSync(GOALS_PATH, JSON.stringify(data, null, 2));
};

async function handleGoals(req, res) {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const method = req.method;
    const goalsData = getStoredGoals();

    auditLog(`GOALS_${method}`, { path: req.path }, userId);

    if (method === 'GET') {
        return res.json(goalsData[userId] || []);
    }

    if (method === 'POST') {
        const newGoal = { ...req.body.goal, id: Date.now().toString() };
        if (!goalsData[userId]) goalsData[userId] = [];
        goalsData[userId].push(newGoal);
        saveStoredGoals(goalsData);
        return res.json(newGoal);
    }

    if (method === 'PATCH' || method === 'PUT') {
        const { goalId } = req.params || {}; // Note: Since we use custom routing, we might need to parse this manually
        // Improved parsing for custom Pathfinder engine
        const segments = req.path.split('/');
        const idFromPath = segments[segments.length - 1];

        const index = (goalsData[userId] || []).findIndex(g => g.id === idFromPath);
        if (index !== -1) {
            goalsData[userId][index] = { ...goalsData[userId][index], ...req.body.goal };
            saveStoredGoals(goalsData);
            return res.json(goalsData[userId][index]);
        }
        return res.status(404).json({ error: 'Goal not found' });
    }

    if (method === 'DELETE') {
        const segments = req.path.split('/');
        const idFromPath = segments[segments.length - 1];

        if (goalsData[userId]) {
            goalsData[userId] = goalsData[userId].filter(g => g.id !== idFromPath);
            saveStoredGoals(goalsData);
            return res.json({ success: true });
        }
        return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}

// --- 🤖 AI HANDLER ---
async function handleGemini(req, res) {
    const { prompt, systemInstruction, userId } = req.body;
    auditLog('AI_REQUEST_HTTP', { path: req.path }, userId);
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY;
    if (!key) return res.status(400).json({ error: 'AI Key Missing' });
    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    const { text, userId } = req.body;
    auditLog('TTS_REQUEST', { textSnippet: text?.substring(0, 30) }, userId);
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_AI_KEY;
    if (!key) return res.status(400).json({ error: 'AI Key Missing' });
    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    const { userId } = req.body;
    auditLog('SEO_ANALYTICS_ACCESS', {}, userId);
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
    const { userId } = req.body;
    auditLog('REVENUE_INTELLIGENCE_ACCESS', {}, userId);
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
    const { recipients, subject, html, userId } = req.body;
    auditLog('EMAIL_BLAST', { recipientCount: recipients?.length, subject }, userId);
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

httpServer.listen(PORT, () => log(`✅ Noble Pathfinder Pro Live on Port ${PORT}`));
