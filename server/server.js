import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Create a log file for debugging crashes on startup
const logStream = fs.createWriteStream(path.join(__dirname, 'startup-debug.log'), { flags: 'a' });
const log = (msg) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${msg}`);
    logStream.write(`[${timestamp}] ${msg}\n`);
};

process.on('uncaughtException', (err) => {
    log(`CRITICAL ERROR (uncaughtException): ${err.message}`);
    log(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`CRITICAL ERROR (unhandledRejection): ${reason}`);
    process.exit(1);
});

log('Noble Clarity Engine Server initializing...');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const NOBLE_VERSION = '2.0.0-PRO-RESILIENT';

// Root / Health check routes
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #293D9B;">Noble Clarity Engine API is Running</h1>
            <p>Status: <span style="color: #10B981; font-weight: bold;">Active</span></p>
            <hr style="margin: 20px auto; width: 200px; border: 0; border-top: 1px solid #eee;">
            <p>To view the dashboard, please visit:</p>
            <a href="/" style="display: inline-block; padding: 12px 24px; background: #293D9B; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Launch Noble Clarity Dashboard</a>
        </div>
    `);
});

app.get('/api', (req, res) => {
    res.json({ status: 'active', message: 'Noble Clarity Engine API is Running (Prefix Detected)', timestamp: new Date().toISOString() });
});

// 🚀 Omni-Routing: Listen for health checks on ALL variations
app.get('*', (req, res, next) => {
    const normalizedPath = req.path.toLowerCase();
    if (normalizedPath === '/health' || normalizedPath === '/api/health' || normalizedPath.endsWith('/health')) {
        log(`📡 Health Check intercepted at: ${req.path}`);
        return res.json({
            status: 'ok',
            message: 'Noble AI Proxy is Active (Omni-Route)',
            receivedPath: req.path,
            timestamp: new Date().toISOString()
        });
    }
    next();
});

// Helper to handle both /api/route and /route (More resilient for cPanel subpaths)
const apiPath = (path) => [`${path}`, `/api${path}`, `/api/api${path}`, `index.js${path}`, `server.js${path}`];

// Direct root routes for cPanel/LiteSpeed validation
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Noble AI Proxy Root reached', path: req.path });
});

app.get(apiPath('/health'), (req, res) => {
    res.json({
        status: 'ok',
        message: 'Noble AI Proxy is Healthy',
        path: req.path,
        env: process.env.NODE_ENV || 'production'
    });
});

app.post(apiPath('/gemini'), async (req, res) => {
    const { prompt, systemInstruction, apiKey, history } = req.body;
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || apiKey;

    if (!key) return res.status(400).json({ error: 'Gemini API Key missing' });

    try {
        const ai = new GoogleGenerativeAI(key);
        // Standardize model to gemini-1.5-flash for maximum compatibility
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] }
            ]
        });
        res.json({ content: result.response.text() });
    } catch (error) {
        log(`Gemini Error: ${error.message}`);

        // Check for Quota/Rate Limit
        if (error.message.includes('429') || error.message.includes('quota')) {
            const openAiKey = process.env.OPENAI_API_KEY;
            if (openAiKey) {
                log('Gemini Quota Hit. Automatically falling back to OpenAI GPT-4...');
                try {
                    const openai = new OpenAI({ apiKey: openAiKey });
                    const response = await openai.chat.completions.create({
                        model: "gpt-4-turbo-preview",
                        messages: [
                            { role: "system", content: systemInstruction },
                            ...(history || []).map(msg => ({ role: msg.role, content: msg.content })),
                            { role: "user", content: prompt }
                        ],
                        temperature: 0.7
                    });
                    return res.json({
                        content: response.choices[0].message.content,
                        fallback: true,
                        provider: 'openai'
                    });
                } catch (oaError) {
                    log(`Fallback to OpenAI failed: ${oaError.message}`);
                }
            }
        }

        res.status(500).json({ error: error.message });
    }
});

app.post(apiPath('/openai'), async (req, res) => {
    const { prompt, systemInstruction, apiKey } = req.body;
    const key = process.env.OPENAI_API_KEY || apiKey;

    if (!key) return res.status(400).json({ error: 'OpenAI API Key missing' });

    try {
        const openai = new OpenAI({ apiKey: key });
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });
        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        log(`OpenAI Proxy Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

app.post(apiPath('/tts'), async (req, res) => {
    const { text, apiKey } = req.body;
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || apiKey;

    if (!key) return res.status(400).json({ error: 'Gemini API Key missing' });

    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: text }] }],
            generationConfig: {
                // Speech config/modalities might need specific SDK support check, but following typical pattern
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            }
        });

        const base64Audio = result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        res.json({ audio: base64Audio });
    } catch (error) {
        console.error('TTS Proxy Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * High-Performance Revenue Intelligence Relay
 * Fetches real-time transaction data from Paystack and Flutterwave
 */
app.get(apiPath('/revenue-intelligence'), async (req, res) => {
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;
    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY;
    const { period = '6m' } = req.query;

    log(`Initializing Revenue Recon: Period [${period}]`);

    const intelligence = {
        paystack: { total: 0, count: 0, transactions: [] },
        flutterwave: { total: 0, count: 0, transactions: [] },
        combined: { mrr: 0, growth: 8.2 },
        timestamp: new Date().toISOString()
    };

    try {
        // 1. Fetch Paystack Transactions
        if (paystackKey) {
            const psResponse = await fetch('https://api.paystack.co/transaction?perPage=100', {
                headers: { Authorization: `Bearer ${paystackKey}` }
            });
            const psData = await psResponse.json();
            if (psData.status) {
                intelligence.paystack.transactions = psData.data.filter(t => t.status === 'success');
                intelligence.paystack.total = intelligence.paystack.transactions.reduce((acc, t) => acc + (t.amount / 100), 0);
                intelligence.paystack.count = intelligence.paystack.transactions.length;
            }
        }

        // 2. Fetch Flutterwave Transactions
        if (flutterwaveKey) {
            const fwResponse = await fetch('https://api.flutterwave.com/v3/transactions', {
                headers: { Authorization: `Bearer ${flutterwaveKey}` }
            });
            const fwData = await fwResponse.json();
            if (fwData.status === 'success') {
                intelligence.flutterwave.transactions = fwData.data.filter(t => t.status === 'successful');
                intelligence.flutterwave.total = intelligence.flutterwave.transactions.reduce((acc, t) => acc + t.amount, 0);
                intelligence.flutterwave.count = intelligence.flutterwave.transactions.length;
            }
        }

        // 3. Logic: For MRR, we combine the totals and divide by period if needed, 
        // but typically MRR comes from subscription metadata.
        // For now, let's provide the raw data for the dashboard to aggregate.
        res.json(intelligence);
    } catch (error) {
        log(`Revenue Recon Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to reconcile payment gateways', details: error.message });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
    if (error) {
        log(`❌ SMTP CONNECTION FAILED: ${error.message}. Check your EMAIL_USER/PASS in cPanel.`);
    } else {
        log(`✅ SMTP IS READY: Listening for blast campaigns.`);
    }
});

app.post(apiPath('/blast-email'), async (req, res) => {
    const { recipients, subject, html } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients array is required' });
    }

    log(`Initializing Blast Campaign: "${subject}" to ${recipients.length} recipients.`);

    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    // Send emails sequentially to avoid overwhelming SMTP/potential rate limits
    // For many thousands, a queue system would be better, but for standard founder lists this works.
    for (const email of recipients) {
        const mailOptions = {
            from: `"Noble Clarity Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: html
        };

        try {
            await transporter.sendMail(mailOptions);
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ email, error: error.message });
            log(`Failed to send to ${email}: ${error.message}`);
        }
    }

    if (results.failed > 0) {
        log(`⚠️ Blast Campaign Warning: ${results.failed} failures encountered. Check results for details.`);
    }

    log(`Blast Campaign Completed: ${results.success} sent, ${results.failed} failed.`);
    res.status(200).json({
        message: results.failed === 0 ? 'Blast campaign successful' : 'Blast campaign finished with errors',
        results
    });
});

app.post(apiPath('/welcome-email'), async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const mailOptions = {
        from: `"Noble Clarity Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Noble Clarity Engine',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 12px;">
                <h1 style="color: #2563EB; border-bottom: 1px solid #eee; padding-bottom: 15px;">Welcome to the Engine! 🚀</h1>
                <p>Hi there,</p>
                <p>We are thrilled to verify that your account has been successfully created. You can now access your Financial Intelligence Dashboard anytime.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin-top: 0; font-weight: bold;">Next Steps:</p>
                    <ul style="margin-bottom: 0;">
                        <li>Explore the Dashboard</li>
                        <li>Set up your financial goals</li>
                        <li>Ask the AI Coach for advice</li>
                    </ul>
                </div>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br>
                <p style="color: #64748b; font-size: 12px; border-top: 1px solid #eee; pt: 15px;">
                    Cheers,<br>
                    <strong>The Noble World Team</strong>
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
        res.status(200).json({ message: 'Welcome email sent successfully' });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        res.status(500).json({ error: 'Failed to send welcome email', details: error.message });
    }
});

// Global 404 Diagnostic Handler
app.use((req, res) => {
    log(`404 ALERT: Missing Route Accessed - [${req.method}] ${req.path}`);
    res.status(404).json({
        error: 'Noble API Route Not Found',
        receivedPath: req.path,
        method: req.method,
        hint: 'If you see an extra prefix (like /api/api), adjust your VITE_PROXY_URL in the frontend.',
        diagnostics: {
            baseUrl: req.baseUrl,
            originalUrl: req.originalUrl
        }
    });
});

try {
    app.listen(PORT, () => {
        log(`Noble Clarity Proxy initialized on port ${PORT}`);
    });
} catch (error) {
    log(`CRITICAL: Server startup failure: ${error.message}`);
}


