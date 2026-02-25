"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm text-white transition-colors"
    >
      <span className={locale === "en" ? "font-bold text-purple-400" : "text-gray-400"}>EN</span>
      <span className="text-gray-500">|</span>
      <span className={locale === "zh" ? "font-bold text-purple-400" : "text-gray-400"}>中</span>
    </button>
  );
}
