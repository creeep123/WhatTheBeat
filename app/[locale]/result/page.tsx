"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import StyleRadar from "@/components/StyleRadar";
import ElementGrid from "@/components/ElementGrid";
import SlangTags from "@/components/SlangTags";
import ResultSummary from "@/components/ResultSummary";
import type { AnalysisResult } from "@/lib/types";

export default function ResultPage() {
  const t = useTranslations("result");
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("wtb_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900">
        <div className="text-gray-400">{t("noData")}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            {t("analyzeAnother")}
          </button>
        </motion.div>

        <ResultSummary bpm={result.bpm} summary={result.summary} />
        <StyleRadar styles={result.styles} />
        <ElementGrid elements={result.elements} />
        <SlangTags tags={result.tags} searchKeywords={result.searchKeywords} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-4"
        >
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm sm:text-base text-white font-medium transition-colors transform hover:scale-105"
          >
            {t("analyzeAnother")}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
