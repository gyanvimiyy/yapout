import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GEMMA_MODEL = 'gemma-4-26b-a4b-it';

app.use(express.json());

// Initialize Google GenAI client for server-side calls
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
} else {
  console.warn('⚠️ GEMINI_API_KEY not found in environment.');
}

// Helper function to call Gemma 4
async function queryGemma4(prompt: string, systemInstruction?: string): Promise<string> {
  if (!aiClient) {
    throw new Error('Gemma 4 API client is not configured: GEMINI_API_KEY is missing.');
  }

  const response = await aiClient.models.generateContent({
    model: GEMMA_MODEL,
    contents: prompt,
    config: systemInstruction
      ? {
          systemInstruction,
          temperature: 0.7
        }
      : {
          temperature: 0.7
        }
  });

  return response.text || 'No response returned from Gemma 4.';
}

// API Health / Status Endpoint
app.get('/api/gemma/status', (req: Request, res: Response) => {
  res.json({
    status: aiClient ? 'connected' : 'unconfigured',
    model: GEMMA_MODEL,
    provider: 'Google DeepMind Gemma 4'
  });
});

// API: General Gemma 4 Social Assistant / Copilot Chat
app.post('/api/gemma/assistant', async (req: Request, res: Response) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const systemInstruction = 
      'You are YapOut AI, a friendly, hyper-knowledgeable campus social assistant powered by Google Gemma 4. ' +
      'Your mission is to help college students and young adults discover like-minded people, explore campus activities, ' +
      'find great hangout spots, break the ice, and turn casual ideas into real social experiences. ' +
      'Keep your tone casual, warm, supportive, authentic to college life, and concise. Avoid robotic jargon.';

    let fullPrompt = prompt;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'Gemma'}: ${h.text}`)
        .join('\n');
      fullPrompt = `Previous conversation:\n${formattedHistory}\n\nStudent: ${prompt}\nGemma:`;
    }

    const reply = await queryGemma4(fullPrompt, systemInstruction);
    res.json({ reply, model: GEMMA_MODEL });
  } catch (error: any) {
    console.error('Gemma 4 Assistant Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate response with Gemma 4.' 
    });
  }
});

// API: Gemma 4 Auto-Plan Hangout
app.post('/api/gemma/plan-hangout', async (req: Request, res: Response) => {
  try {
    const { idea, campus } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Hangout idea is required.' });
    }

    const systemInstruction = 
      'You are an expert college hangout planner powered by Gemma 4. Given a rough idea or topic from a student, ' +
      'create a complete, structured hangout plan. You must respond ONLY with a valid JSON object without markdown fences, with these exact keys:\n' +
      '{\n' +
      '  "title": "A fun, catchy title with an emoji",\n' +
      '  "category": "coffee" | "study" | "boba" | "sports" | "food" | "outdoors" | "gaming" | "arts" | "nightout",\n' +
      '  "description": "2-3 sentences explaining the vibe, plan, and what to bring",\n' +
      '  "campusSpot": "A specific realistic campus location (e.g. library patio, lawn, local cafe)",\n' +
      '  "vibe": "3-4 word vibe description (e.g. Cozy & Deep Conversations)",\n' +
      '  "costNote": "Estimated cost (e.g. Free or ~$5)",\n' +
      '  "duration": "Duration (e.g. 1.5 hours)",\n' +
      '  "maxSpots": 4 to 8,\n' +
      '  "tags": ["Tag1", "Tag2", "Tag3"],\n' +
      '  "icebreakers": ["Icebreaker question 1", "Icebreaker question 2"]\n' +
      '}';

    const prompt = `Plan a campus hangout based on this concept: "${idea}". Campus/Context: "${campus || 'College Campus'}". Return pure JSON.`;
    const responseText = await queryGemma4(prompt, systemInstruction);

    // Parse JSON safely
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanJson);
      res.json(parsed);
    } catch {
      // If JSON parsing fails, wrap text
      res.json({
        title: `Hangout: ${idea}`,
        category: 'coffee',
        description: responseText,
        campusSpot: 'Campus Commons / Local Cafe',
        vibe: 'Friendly & Casual',
        costNote: 'Free / Buy your own',
        duration: '1.5 hours',
        maxSpots: 5,
        tags: ['YapOut', 'CampusMeetup'],
        icebreakers: ['What brings you to campus today?']
      });
    }
  } catch (error: any) {
    console.error('Gemma 4 Plan Hangout Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to auto-plan hangout with Gemma 4.' 
    });
  }
});

// API: Gemma 4 Generate Yap Channel Icebreakers
app.post('/api/gemma/icebreakers', async (req: Request, res: Response) => {
  try {
    const { hangoutTitle, hangoutVibe, count } = req.body;
    const systemInstruction = 
      'You are Gemma 4, generating lively, creative, un-awkward conversation starters and icebreakers for a college hangout group chat (the Yap Channel). ' +
      'Make them authentic to young adults, low-stakes, and fun to debate.';

    const prompt = `Give me ${count || 3} short, punchy icebreaker questions for attendees going to this hangout: "${hangoutTitle || 'Campus Hangout'}" (Vibe: "${hangoutVibe || 'Casual'}"). Return a numbered list.`;
    const reply = await queryGemma4(prompt, systemInstruction);
    res.json({ icebreakers: reply, model: GEMMA_MODEL });
  } catch (error: any) {
    console.error('Gemma 4 Icebreaker Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate icebreakers with Gemma 4.' 
    });
  }
});

// API: Gemma 4 Spontaneous Beacon Generator
app.post('/api/gemma/generate-beacon', async (req: Request, res: Response) => {
  try {
    const { location, freeTime, mood } = req.body;
    const systemInstruction = 
      'You are Gemma 4 helping a student broadcast a quick, punchy, spontaneous beacon on YapOut Campus Radar. ' +
      'Generate a 1-sentence friendly invitation that students nearby will want to join immediately.';

    const prompt = `I am at ${location || 'the campus quad'} with about ${freeTime || 30} minutes free. Mood/vibe: ${mood || 'coffee and quick chat'}. Write 1 short, inviting beacon message with emojis.`;
    const reply = await queryGemma4(prompt, systemInstruction);
    res.json({ message: reply.trim().replace(/^"|"$/g, ''), model: GEMMA_MODEL });
  } catch (error: any) {
    console.error('Gemma 4 Beacon Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate beacon with Gemma 4.' 
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 YapOut server running on port ${PORT} with Gemma 4 integration (${GEMMA_MODEL})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
