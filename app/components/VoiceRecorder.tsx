// app/components/VoiceRecorder.tsx
'use client';

import { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  selectedClass: string;
}

export default function VoiceRecorder({ onRecordingComplete, selectedClass }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    if (!selectedClass) {
      alert('Please select a class type first!');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Auto-stop after 30 seconds
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  return (
    <div>
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={!selectedClass}
          className="group px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-2xl">🔴</span>
          <span>Start Recording</span>
          <span className="text-sm font-normal opacity-70">(30 seconds)</span>
        </button>
      ) : (
        <div className="space-y-4">
          {/* Recording Indicator */}
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 flex items-center gap-4">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-lg mb-1">Recording...</div>
              <div className="text-white/80 text-sm">Speak naturally about your workout</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {recordingTime}s
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-1000"
              style={{ width: `${(recordingTime / 30) * 100}%` }}
            ></div>
          </div>

          {/* Stop Button */}
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all"
          >
            ⏹️ Stop Early
          </button>
        </div>
      )}
    </div>
  );
}