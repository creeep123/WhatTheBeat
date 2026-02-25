"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "audio/mp3", "audio/mpeg", "audio/wav", "audio/wave",
  "audio/aac", "audio/ogg", "audio/flac", "audio/x-m4a", "audio/mp4",
];

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileSelected, disabled }: FileUploaderProps) {
  const t = useTranslations("home");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_SIZE) {
      setError(t("fileTooLarge"));
      return;
    }
    if (!file.type.startsWith("audio/") && !ACCEPTED_TYPES.some((t) => file.type.includes(t.split("/")[1]))) {
      setError(t("unsupportedFormat"));
      return;
    }
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const audioFile = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("audio/"));
    if (audioFile) validateAndSelect(audioFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        className={`
          w-full flex flex-col items-center gap-2 sm:gap-3 p-6 sm:p-8 rounded-xl border-2 border-dashed
          transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          ${isDragging
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10"
          }
        `}
      >
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 group-hover:scale-110 transition-transform" />
        <span className="text-white font-medium text-base sm:text-lg">{t("uploadButton")}</span>
        <span className="text-gray-400 text-xs sm:text-sm text-center">{t("dragHint")}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
