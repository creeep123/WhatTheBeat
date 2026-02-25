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
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{t("styleRadar")}</h3>

      <div className="w-full h-[250px]">
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
              width={100}
              tick={{ fill: "#d1d5db", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{ fill: "#e5e7eb", fontSize: 13, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <p className="text-sm text-gray-300">
              <span className="text-white font-medium">{s.name}:</span> {s.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
