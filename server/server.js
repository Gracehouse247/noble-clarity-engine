
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Root / Health check routes
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #293D9B;">Noble Clarity Engine API is Running</h1>
            <p>Status: <span style="color: #10B981; font-weight: bold;">Active</span></p>
            <hr style="margin: 20px auto; width: 200px; border: 0; border-top: 1px solid #eee;">
            <p>To view the dashboard, please visit:</p>
            <a href="http://localhost:3000" style="display: inline-block; padding: 12px 24px; background: #293D9B; color: white; text-decoration: none; rounded: 8px; font-weight: bold;">Launch Noble Clarity Dashboard</a>
        </div>
    `);
});

app.get('/api', (req, res) => {
    res.json({ status: 'active', message: 'Noble Clarity Engine API is Running (Prefix Detected)', timestamp: new Date().toISOString() });
});

// Helper to handle both /api/route and /route
const apiPath = (path) => [`${path}`, `/api${path}`];

app.post(apiPath('/gemini'), async (req, res) => {
    const { prompt, systemInstruction, apiKey } = req.body;
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || apiKey;

    if (!key) return res.status(400).json({ error: 'Gemini API Key missing' });

    try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemInstruction
        });
        const result = await model.generateContent(prompt);
        res.json({ content: result.response.text() });
    } catch (error) {
        console.error('Gemini Proxy Error:', error);
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
        console.error('OpenAI Proxy Error:', error);
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
            model: "gemini-2.0-flash-exp",
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

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred service or SMTP config
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post(apiPath('/welcome-email'), async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Noble Clarity Engine',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #2563EB;">Welcome to the Engine! 🚀</h1>
                <p>Hi there,</p>
                <p>We are thrilled to verify that your account has been successfully created. You can now access your Financial Intelligence Dashboard anytime.</p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Explore the Dashboard</li>
                    <li>Set up your financial goals</li>
                    <li>Ask the AI Coach for advice</li>
                </ul>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br>
                <p>Cheers,</p>
                <p>The Noble World Team</p>
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

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Noble Clarity Proxy running on http://localhost:${PORT}`);
    });
}

// Export for Vercel functions
export default app;
