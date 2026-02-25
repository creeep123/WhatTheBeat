"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";
import type { StyleBreakdown } from "@/lib/types";

const COLORS = [
  "#a855f7", "#c084fc", "#e879f9", "#f472b6", "#fb7185", "#f59e0b",
];

interface StyleRadarProps {
  styles: StyleBreakdown[];
}

export default function StyleRadar({ styles }: StyleRadarProps) {
  const t = useTranslations("result");

  const data = styles
    .sort((a, b) => b.percentage - a.percentage)
    .map((s) => ({
      name: s.name,
      percentage: s.percentage,
      description: s.description,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{t("styleRadar")}</h3>

      <div className="w-full h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: "#d1d5db", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(v: any) => `${v}%`}
                style={{ fill: "#e5e7eb", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
        {data.map((s, i) => (
          <div key={i} className="flex items-start gap-1.5 sm:gap-2">
            <span
              className="mt-1 sm:mt-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <p className="text-xs sm:text-sm text-gray-300">
              <span className="text-white font-medium">{s.name}:</span> {s.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
