"use client";

import FileUploader from "./FileUploader";
import MicRecorder from "./MicRecorder";

interface AudioInputProps {
  onAudioReady: (file: File) => void;
  disabled?: boolean;
}

export default function AudioInput({ onAudioReady, disabled }: AudioInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileUploader onFileSelected={onAudioReady} disabled={disabled} />
      <MicRecorder onRecordingComplete={onAudioReady} disabled={disabled} />
    </div>
  );
}
