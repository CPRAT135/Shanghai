import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildPlannerSystemInstruction,
  formatChatRequestPrompt,
  sanitizeChatMessages,
  type PlannerPreferences,
} from './src/utils/plannerLogic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const MODEL_NAME = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  app.post('/api/planner/chat', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'Gemini API key is not configured on the server. Please add GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const body = req.body as {
      messages?: unknown;
      preferences?: Partial<PlannerPreferences>;
    };

    const sanitized = sanitizeChatMessages(body?.messages, 24);
    if (sanitized.length === 0) {
      res.status(400).json({ error: 'Please enter a message to start planning.' });
      return;
    }

    const lastTurn = sanitized[sanitized.length - 1];
    if (lastTurn.role !== 'user') {
      res.status(400).json({ error: 'The latest message in the conversation must be from the user.' });
      return;
    }

    const priorHistory = sanitized.slice(0, -1).map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    }));

    const systemInstruction = buildPlannerSystemInstruction(body?.preferences);
    const promptWithProfile = formatChatRequestPrompt(lastTurn.text, body?.preferences);

    let lastError: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const startedAt = Date.now();
      try {
        const chat = ai.chats.create({
          model: MODEL_NAME,
          ...(priorHistory.length > 0 ? { history: priorHistory } : {}),
          config: {
            systemInstruction,
            abortSignal: AbortSignal.timeout(90000),
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });

        const response = await chat.sendMessage({
          message: promptWithProfile,
        });

        console.log(`[Planner API] ${MODEL_NAME} responded in ${Date.now() - startedAt}ms`);

        const reply = response.text?.trim();
        if (!reply) {
          res.status(502).json({
            error: 'The AI planner returned an empty response. Please try rephrasing your question.',
          });
          return;
        }

        res.json({
          reply,
          model: MODEL_NAME,
        });
        return;
      } catch (err) {
        lastError = err;
        const message = err instanceof Error ? err.message : String(err);
        console.error(
          `[Planner API attempt ${attempt + 1} error after ${Date.now() - startedAt}ms]`,
          message,
        );
        const isTransient =
          message.includes('503') ||
          message.includes('UNAVAILABLE') ||
          message.includes('429');
        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }
        break;
      }
    }

    const errMessage =
      lastError instanceof Error ? lastError.message : 'Unable to reach Gemini service.';
    res.status(502).json({
      error: `Unable to generate itinerary right now (${errMessage}). Please try again.`,
    });
  });

  // Never allow unmatched /api/* routes to fall through to SPA HTML (200 OK)
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Shanghai editorial guide server listening at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
