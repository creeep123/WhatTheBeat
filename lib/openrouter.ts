import type { AnalysisResult } from "./types";

const ANALYSIS_PROMPT = `You are an expert Hip-Hop music producer and audio analyst with deep knowledge of all sub-genres. Based on this audio analysis request, generate a realistic and detailed beat analysis.

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
- "bpm" should be a realistic tempo between 60-180
- "elements" must have 3-5 entries describing core sonic elements (drums, bass, melody, atmosphere, samples, vocal chops, etc.)
- "tags" must have 5-10 entries using authentic Hip-Hop producer slang (e.g., "808 heavy", "chopped samples", "trap rolls", "dusty loops", "dark melody")
- "searchKeywords" should be useful for searching beat marketplaces or YouTube
- "summary" should read like a knowledgeable producer describing the beat

Since this is a demo/test, generate a realistic example analysis for a modern trap-influenced beat with melodic elements. Make it sound authentic and detailed.

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

export async function analyzeAudio(
  base64Audio: string,
  mimeType: string
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://whatthebeat.vercel.app",
        "X-Title": "WhatTheBeat"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "user",
            content: ANALYSIS_PROMPT
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from OpenRouter API");
    }

    // Strip markdown fences if present
    const jsonStr = content.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!parsed.styles?.length || !parsed.elements?.length || !parsed.tags?.length) {
      throw new Error("Invalid response structure from AI");
    }

    // Ensure percentages sum to 100
    const total = parsed.styles.reduce((sum, s) => sum + s.percentage, 0);
    if (total !== 100) {
      const factor = 100 / total;
      parsed.styles = parsed.styles.map(s => ({
        ...s,
        percentage: Math.round(s.percentage * factor)
      }));

      // Adjust last item to ensure exactly 100
      const newTotal = parsed.styles.slice(0, -1).reduce((sum, s) => sum + s.percentage, 0);
      parsed.styles[parsed.styles.length - 1].percentage = 100 - newTotal;
    }

    return parsed;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw error;
  }
}