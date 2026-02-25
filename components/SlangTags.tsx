"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Copy, Check, Search } from "lucide-react";

interface SlangTagsProps {
  tags: string[];
  searchKeywords: string;
}

export default function SlangTags({ tags, searchKeywords }: SlangTagsProps) {
  const t = useTranslations("result");
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const copyToClipboard = async (text: string, type: "tags" | "keywords") => {
    await navigator.clipboard.writeText(text);
    if (type === "tags") {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } else {
      setCopiedKeywords(true);
      setTimeout(() => setCopiedKeywords(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      {/* Tags Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{t("tags")}</h3>
          <button
            onClick={() => copyToClipboard(tags.join(", "), "tags")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            {copiedTags ? (
              <>
                <Check className="w-4 h-4" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {t("copyTags")}
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Search Keywords Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">{t("searchKeywords")}</h3>
          </div>
          <button
            onClick={() => copyToClipboard(searchKeywords, "keywords")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            {copiedKeywords ? (
              <>
                <Check className="w-4 h-4" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {t("copyKeywords")}
              </>
            )}
          </button>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <p className="text-gray-300 text-sm font-mono break-all">{searchKeywords}</p>
        </div>
      </div>
    </motion.div>
  );
}
