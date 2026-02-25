"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface ResultSummaryProps {
  bpm: number;
  summary: string;
}

export default function ResultSummary({ bpm, summary }: ResultSummaryProps) {
  const t = useTranslations("result");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider">{t("bpm")}</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{bpm}</p>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{t("summary")}</h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{summary}</p>
        </div>
      </div>
    </motion.div>
  );
}
