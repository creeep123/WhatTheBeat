import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "./types";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const ANALYSIS_PROMPT = `You are an expert Hip-Hop music producer and audio analyst with deep knowledge of all sub-genres. Analyze the provided audio clip and return a JSON analysis.

Your response MUST be valid JSON matching this exact schema:
{
  "styles": [
    {"name": "string (Hip-Hop sub-genre)", "percentage": number (0-100), "description": "string (1 sentence explaining why)"}
  ],
  "bpm": number,
  "elements": [
    {"name": "string", "description": "string (1-2 sentences)", "icon": "string (one of: drum, music, bass, waves, mic, radio, headphones, volume-2, zap, sparkles)"}
  ],
  "tags": ["string (Hip-Hop slang/pro terminology)"],
  "searchKeywords": "string (comma-separated keywords for finding similar beats on YouTube/Bilibili)",
  "summary": "string (2-3 sentence summary of the beat's character, written like a producer talking to another producer)"
}

Rules:
- "styles" must have 3-6 entries. Percentages MUST sum to 100. Use real Hip-Hop sub-genres: Trap, Boom Bap, Lo-fi, Drill (UK/NY/Chicago), Phonk, Cloud Rap, G-Funk, Crunk, Chopped & Screwed, Jersey Club, Memphis Rap, Hyphy, Grime, Plugg, Rage, Detroit Type, etc.
- "bpm" should be your best estimate of the tempo
- "elements" must have 3-5 entries describing core sonic elements (drums, bass, melody, atmosphere, samples, vocal chops, etc.)
- "tags" must have 5-10 entries using authentic Hip-Hop producer slang (e.g., "808 heavy", "chopped samples", "trap rolls", "dusty loops", "dark melody")
- "searchKeywords" should be useful for searching beat marketplaces or YouTube
- "summary" should read like a knowledgeable producer describing the beat

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

export async function analyzeAudio(
  base64Audio: string,
  mimeType: string
): Promise<AnalysisResult> {
  const aiInstance = getAI();
  if (!aiInstance) {
    throw new Error("Gemini API key not configured");
  }

  const response = await aiInstance.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          { text: ANALYSIS_PROMPT },
          {
            inlineData: {
              mimeType,
              data: base64Audio,
            },
          },
        ],
      },
    ],
    config: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const text = response.text?.trim() ?? "";

  // Strip markdown fences if present
  const jsonStr = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  if (!parsed.styles?.length || !parsed.elements?.length || !parsed.tags?.length) {
    throw new Error("Invalid response structure from AI");
  }

  return parsed;
}
