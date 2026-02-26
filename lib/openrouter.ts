import type { AnalysisResult } from "./types";

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
- "bpm" should be your best estimate of the actual tempo from the audio
- "elements" must have 3-5 entries describing core sonic elements (drums, bass, melody, atmosphere, samples, vocal chops, etc.)
- "tags" must have 5-10 entries using authentic Hip-Hop producer slang (e.g., "808 heavy", "chopped samples", "trap rolls", "dusty loops", "dark melody")
- "searchKeywords" should be useful for searching beat marketplaces or YouTube
- "summary" should read like a knowledgeable producer describing the beat

Analyze the actual audio provided and return accurate results based on what you hear.

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

export async function analyzeAudio(
  base64Audio: string,
  mimeType: string
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  // Extract audio format from MIME type
  const formatMap: Record<string, string> = {
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/wave": "wav",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/flac": "flac",
    "audio/m4a": "m4a",
    "audio/webm": "webm"
  };

  const audioFormat = formatMap[mimeType] || "wav";

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
        model: "google/gemini-3-flash-preview",  // Use Gemini 3 Flash Preview
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: ANALYSIS_PROMPT
              },
              {
                type: "input_audio",
                input_audio: {
                  data: base64Audio,
                  format: audioFormat
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        stream: true  // Enable streaming to get reasoning tokens
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error response:", error);
      throw new Error(`OpenRouter API error: ${error}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let responseContent = "";
    let buffer = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process each complete line
      const lines = buffer.split('\n');
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              responseContent += content;
            }

            // Log usage info if present
            if (parsed.usage) {
              console.log("Token usage:", parsed.usage);
              if (parsed.usage.reasoningTokens) {
                console.log("Reasoning tokens:", parsed.usage.reasoningTokens);
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    if (!responseContent) {
      throw new Error("No response content from OpenRouter API");
    }

    // Strip markdown fences if present
    const jsonStr = responseContent.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse response:", responseContent);
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