"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ElementCard from "./ElementCard";
import type { CoreElement } from "@/lib/types";

interface ElementGridProps {
  elements: CoreElement[];
}

export default function ElementGrid({ elements }: ElementGridProps) {
  const t = useTranslations("result");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold text-white mb-4">{t("elements")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elements.map((element, index) => (
          <ElementCard key={index} element={element} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
