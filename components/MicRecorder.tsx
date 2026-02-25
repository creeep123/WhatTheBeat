"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mic, Square } from "lucide-react";
import { convertBlobToWav, getSupportedMimeType } from "@/lib/audioUtils";

const MAX_DURATION = 30;

interface MicRecorderProps {
  onRecordingComplete: (file: File) => void;
  disabled?: boolean;
}

export default function MicRecorder({ onRecordingComplete, disabled }: MicRecorderProps) {
  const t = useTranslations("home");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (isRecording && elapsed >= MAX_DURATION) {
      stopRecording();
    }
  }, [elapsed, isRecording, stopRecording]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, { type: mimeType });
        try {
          const wavBlob = await convertBlobToWav(blob);
          const file = new File([wavBlob], "recording.wav", { type: "audio/wav" });
          onRecordingComplete(file);
        } catch {
          // If WAV conversion fails (e.g., Safari), send original format
          const ext = mimeType.includes("mp4") ? "m4a" : "webm";
          const file = new File([blob], `recording.${ext}`, { type: mimeType });
          onRecordingComplete(file);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } catch {
      setError(t("micPermissionDenied"));
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      {isRecording ? (
        <button
          type="button"
          onClick={stopRecording}
          className="w-full flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-xl border-2 border-red-500 bg-red-500/10 transition-all duration-200 group cursor-pointer"
        >
          <div className="relative">
            <Square className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <span className="text-white font-medium text-base sm:text-lg">{t("stopRecording")}</span>
          <span className="text-gray-300 text-xs sm:text-sm font-mono">
            {formatTime(elapsed)} / {formatTime(MAX_DURATION)}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="w-full flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-base sm:text-lg">{t("micButton")}</span>
          <span className="text-gray-400 text-xs sm:text-sm text-center">{t("supportedFormats")}</span>
        </button>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
