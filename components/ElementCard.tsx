"use client";

import { motion } from "framer-motion";
import {
  Drum, Music, Waves, Mic, Radio, Headphones,
  Volume2, Zap, Sparkles, AudioLines,
} from "lucide-react";
import type { CoreElement } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  drum: Drum,
  music: Music,
  bass: AudioLines,
  waves: Waves,
  mic: Mic,
  radio: Radio,
  headphones: Headphones,
  "volume-2": Volume2,
  zap: Zap,
  sparkles: Sparkles,
};

interface ElementCardProps {
  element: CoreElement;
  index: number;
}

export default function ElementCard({ element, index }: ElementCardProps) {
  const Icon = ICON_MAP[element.icon] || Music;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-400/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h4 className="text-white font-medium">{element.name}</h4>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{element.description}</p>
    </motion.div>
  );
}
