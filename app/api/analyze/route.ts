import { NextRequest, NextResponse } from "next/server";
import { analyzeAudio } from "@/lib/gemini";
import type { ApiResponse } from "@/lib/types";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large (max 20MB)" },
        { status: 400 }
      );
    }

    if (!audioFile.type.startsWith("audio/")) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const result = await analyzeAudio(base64Data, audioFile.type);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Analysis failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
