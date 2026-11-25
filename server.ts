import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI server-side client if key is present
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Troubleshooting Assistant ("Ask RIDER AI")
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { problem, deviceOrApp, category } = req.body;
    if (!problem) {
      return res.status(400).json({ error: 'Problem description is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please add your GEMINI_API_KEY in the Secrets panel.' 
      });
    }

    const prompt = `You are RIDER Expert AI, a senior technical support engineer for "Rider All Problems Solution" (Every Problem Has a Solution).
A user is experiencing the following issue:
- Category: ${category || 'General Technology'}
- Device/App: ${deviceOrApp || 'Universal / General'}
- Problem Description: ${problem}

Provide a structured, accurate, and easy-to-follow troubleshooting guide in JSON format or clean Markdown with the following sections:
1. Diagnosis / Likely Root Cause (1-2 sentences)
2. Immediate Quick Fix
3. Step-by-Step Solution (Numbered list with clear action steps)
4. Pro Tip / Prevention Advice
5. Frequently Asked Questions (2 FAQs with short answers)

Keep the tone professional, helpful, encouraging, and clear.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: 'You are RIDER Expert AI, providing precise, expert technical troubleshooting for Android, apps, internet, and tech devices.',
      }
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Gemini AI API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI troubleshooting guide.' });
  }
});

// XML Sitemap endpoint for SEO compliance
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const baseUrl = req.protocol + '://' + req.get('host');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
  res.send(xml);
});

// robots.txt endpoint for SEO compliance
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  const baseUrl = req.protocol + '://' + req.get('host');
  const robots = `User-agent: *
Allow: /
Disallow: /admin-cms

Sitemap: ${baseUrl}/sitemap.xml`;
  res.send(robots);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rider All Problems Solution server running on http://localhost:${PORT}`);
  });
}

startServer();
