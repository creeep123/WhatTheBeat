"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AnimatePresence } from "framer-motion";
import AudioInput from "@/components/AudioInput";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { ApiResponse } from "@/lib/types";

export default function Home() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleAudioReady = async (file: File) => {
    setError(null);
    setSelectedFileName(file.name);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Analysis failed");
      }

      sessionStorage.setItem("wtb_result", JSON.stringify(data.data));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isAnalyzing && <LoadingOverlay />}
      </AnimatePresence>

      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 pt-16 sm:pt-20 bg-gradient-to-br from-purple-900 via-black to-purple-900">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              WhatThe<span className="text-purple-400">Beat</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              {tc("tagline")}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
              {t("title")}
            </h2>

            <div className="space-y-4">
              <AudioInput onAudioReady={handleAudioReady} disabled={isAnalyzing} />

              {selectedFileName && !isAnalyzing && !error && (
                <p className="text-sm text-gray-400 text-center">
                  Selected: {selectedFileName}
                </p>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-400 text-center">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                <p className="text-xs sm:text-sm text-gray-300 text-center">
                  <span className="font-medium text-purple-300">{t("proTip")}</span>{" "}
                  {t("proTipText")}
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          </footer>
        </div>
      </main>
    </>
  );
}
