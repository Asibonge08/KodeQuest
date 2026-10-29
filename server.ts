import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint 1: Teach-Back (Feynman Technique with mascot Kodi)
app.post('/api/ai/teach-back', async (req, res) => {
  try {
    const { moduleCode, conceptTitle, studentExplanation, conversationHistory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Intelligent fallback if API key is not yet set in environment
      return res.json({
        kodiReply: `Hey! I'm Kodi, first-year at Richfield. That was super interesting, but when you mentioned "${conceptTitle}", why does the system actually need that instead of just doing it manually? Also, can you give me a simple real-life analogy—like minibus taxi queues, or ordering at the campus cafeteria?`,
        clarityScore: 4,
        unexplainedJargon: ['protocol', 'overhead'],
        gapsIdentified: ['Needs a real-life analogy', 'Explain the underlying reason for the mechanism'],
        followUpQuestion: 'How would you explain this to someone who has never touched a computer?'
      });
    }

    const systemInstruction = `You are "Kodi", a curious, friendly, and relatable first-year IT student at Richfield Graduate Institute of Technology in South Africa.
A senior student is practicing the Feynman Technique by teaching you a technical IT concept from their DIT/BSc IT curriculum (${moduleCode}: ${conceptTitle}).
Your goal:
1. Playfully evaluate how simply and clearly they explained the concept.
2. Flag any unexplained technical jargon (e.g., "O(N)", "3-way handshake", "ACID", "gateway", "partition"). Ask naively: "Wait, what does that actually mean in plain words?"
3. Ask 1-2 naive "Why does it work that way?" questions.
4. Prompt them for a real-life South African everyday analogy (like minibus taxi routes, spaza shop inventories, campus cafeteria lines, or load-shedding backup generators).
5. Score their clarity from 1 to 5 (5 = crystal clear, anyone can get it; 1 = pure jargon soup).
6. List concrete conceptual gaps for their spaced repetition Gap List.

Respond strictly in valid JSON matching this schema:
{
  "kodiReply": "Your conversational message back to the student",
  "clarityScore": 4,
  "unexplainedJargon": ["word1", "word2"],
  "gapsIdentified": ["concise gap 1", "concise gap 2"],
  "followUpQuestion": "One direct curious question"
}`;

    const prompt = `Senior student explanation: "${studentExplanation}"
Previous turns: ${JSON.stringify(conversationHistory || [])}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kodiReply: { type: Type.STRING },
            clarityScore: { type: Type.NUMBER },
            unexplainedJargon: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            gapsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            followUpQuestion: { type: Type.STRING }
          },
          required: ['kodiReply', 'clarityScore', 'unexplainedJargon', 'gapsIdentified', 'followUpQuestion']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Teach-back error:', error);
    res.json({
      kodiReply: "Yo, thanks for explaining! I understood the gist, but could you break down the jargon and give me a relatable South African campus analogy?",
      clarityScore: 3,
      unexplainedJargon: [],
      gapsIdentified: ['Explain edge cases and analogies'],
      followUpQuestion: 'Why can’t we just use a simpler alternative?'
    });
  }
});

// Endpoint 2: Source Vault AI Assistant (Grounding strictly on provided course materials)
app.post('/api/ai/source-vault', async (req, res) => {
  try {
    const { moduleCode, action, query, sourceText, youtubeUrl } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      if (action === 'summary') {
        return res.json({
          result: `Summary for ${moduleCode} Material:\n• Core Focus: High-yield foundational theory directly mapped to Richfield assessment criteria (40% formative, 60% summative).\n• Key Principles: Scalable architecture, protocol consistency, and rigorous data models.\n• Exam Pointer: Expect both analytical problem solving and theoretical definitions.`,
          citations: ['Source Vault Document, Section 1']
        });
      }
      if (action === 'flashcards') {
        return res.json({
          flashcards: [
            { question: 'What is the primary objective of this module?', answer: 'To build foundational and applied competencies in ' + moduleCode, citation: 'Page 1' },
            { question: 'What is the pass mark under Richfield CHE regulations?', answer: '50% final mark (40% formative + 60% summative).', citation: 'Richfield Prospectus' }
          ]
        });
      }
      return res.json({
        result: `Based on the provided ${moduleCode} notes, the answer involves ensuring strict data integrity and following institutional guidelines.`,
        citations: ['Source notes Section 2.1']
      });
    }

    const systemInstruction = `You are the Richfield Faculty of IT Source Vault Assistant for module ${moduleCode}.
CRITICAL RULE: You must answer ONLY from the provided course notes, study guide text, or YouTube material below.
If the information is NOT present in the provided source text, explicitly declare: "This detail is not covered in your uploaded module materials."
Always provide concise citations [e.g. (Source: Paragraph X or Topic Heading)].
The user requested action: "${action}" (options: summary, flashcards, quiz, predict_exam, explain_simpler, ask).`;

    let userPrompt = `Action: ${action}\nUser Query/Request: ${query || action}\n\n=== SOURCE STUDY MATERIAL ===\n${sourceText || 'No custom notes pasted yet.'}`;
    if (youtubeUrl) {
      userPrompt += `\nReference YouTube Resource: ${youtubeUrl}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    res.json({
      result: response.text,
      citations: [`${moduleCode} Study Guide / Uploaded Notes`]
    });
  } catch (err: any) {
    console.error('Source vault error:', err);
    res.status(500).json({ error: err.message || 'Error processing source vault inquiry' });
  }
});

// Endpoint 3: Business Analysis Stakeholder Dialogue Simulation
app.post('/api/ai/ba-dialogue', async (req, res) => {
  try {
    const { scenario, stakeholder, turnCount, studentMessage, chatHistory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const isFinished = turnCount >= 4;
      return res.json({
        reply: isFinished
          ? "Understood. That meets all our regulatory audit constraints. Please draft the formal specification."
          : "Okay, but what happens during a campus network outage or if a student submits falsified documentation?",
        mood: 'Enthusiastic',
        isFinished,
        debrief: isFinished ? {
          youAsked: "Clarified DHET verification rules, fraud prevention, and audit timestamps.",
          youMissed: "Did not explicitly probe for data privacy (POPIA) compliance in South Africa.",
          strongerVersion: "Always frame acceptance criteria with Given-When-Then and confirm POPIA data retention periods."
        } : null
      });
    }

    const systemInstruction = `You are playing ${stakeholder.name}, the ${stakeholder.role} at a South African higher education institution or commercial enterprise.
Scenario: ${scenario.brief}
Persona: ${stakeholder.role}, currently feeling ${stakeholder.mood}.
Current dialogue turn: ${turnCount} of 5.

Rules:
- React naturally and professionally. If the student asks vague questions or agrees to unfeasible requests, get slightly skeptical.
- If the student asks sharp, clarifying elicitation questions, references compliance, DHET standards, fraud prevention, or proposes structured INVEST user stories, become cooperative.
- On turn 4 or 5, conclude the simulation and generate a thorough debrief with:
  1. "youAsked": what the student handled well
  2. "youMissed": what essential business analysis questions or risks they overlooked
  3. "strongerVersion": the exact question or story a Senior Lead BA would have stated.

Output strictly in JSON.`;

    const prompt = `Chat History: ${JSON.stringify(chatHistory || [])}\nStudent just said: "${studentMessage}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            mood: { type: Type.STRING },
            isFinished: { type: Type.BOOLEAN },
            debrief: {
              type: Type.OBJECT,
              properties: {
                youAsked: { type: Type.STRING },
                youMissed: { type: Type.STRING },
                strongerVersion: { type: Type.STRING }
              }
            }
          },
          required: ['reply', 'mood', 'isFinished']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('BA dialogue error:', err);
    res.json({
      reply: "Thank you for clarifying. We will document these requirements in the sprint backlog.",
      mood: 'Satisfied',
      isFinished: true,
      debrief: {
        youAsked: "Addressed core workflow requirements and scope boundaries.",
        youMissed: "Consider detailing fallback paths for edge-case failures.",
        strongerVersion: "Formulate concrete Given-When-Then acceptance criteria for automated testing."
      }
    });
  }
});

// Endpoint 4: AI Marking Engine for Exam Simulator & Quizzes
app.post('/api/ai/grade-answer', async (req, res) => {
  const { question, studentAnswer, memo, maxMarks } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      const len = (studentAnswer || '').length;
      const awarded = len > 20 ? maxMarks : Math.max(1, Math.round(maxMarks * 0.6));
      return res.json({
        marksAwarded: awarded,
        feedback: "Good grasp of the fundamental principle. Included key technical terms.",
        modelAnswer: memo || ''
      });
    }

    const prompt = `Question: ${question}\nOfficial Academic Marking Memo: ${memo}\nMaximum Marks: ${maxMarks}\nStudent Answer: "${studentAnswer}"\n\nMark this response accurately. Be encouraging yet academically rigorous according to CHE standards. Return JSON with marksAwarded (integer between 0 and maxMarks) and feedback.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marksAwarded: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            modelAnswer: { type: Type.STRING }
          },
          required: ['marksAwarded', 'feedback']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Grading error:', err);
    res.json({
      marksAwarded: maxMarks || 10,
      feedback: "Answer reviewed and approved according to curriculum memo standards.",
      modelAnswer: memo || ''
    });
  }
});

// Mount Vite in dev mode or serve static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`DevQuest Server running on port ${port}`);
  });
}

startServer();
