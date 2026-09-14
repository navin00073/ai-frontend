import React, { useState, useRef, useEffect } from 'react';
import {
  ScanFace,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Student } from '../types';
import { biometricEngine } from '../services/BiometricEngine';

interface FaceEnrollmentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentComplete: (studentId: string, embedding: number[]) => void;
}

const POSES = [
  { id: 1, title: 'Frontal Pose', instruction: 'Look directly into the camera lens with neutral expression' },
  { id: 2, title: 'Left 30° Profile', instruction: 'Gently turn your head slightly to the left' },
  { id: 3, title: 'Right 30° Profile', instruction: 'Gently turn your head slightly to the right' },
  { id: 4, title: 'Upward / Downward Pitch', instruction: 'Tilt head slightly upward then downward' }
];

export const FaceEnrollmentModal: React.FC<FaceEnrollmentModalProps> = ({
  student,
  isOpen,
  onClose,
  onEnrollmentComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3
  const [capturedSamples, setCapturedSamples] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCapturedSamples([]);
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [isOpen]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Could not start camera for enrollment:", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const captureCurrentPose = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // Capture frame
      let dataUrl = student.profilePhoto;
      if (videoRef.current) {
        try {
          const c = document.createElement('canvas');
          c.width = 320;
          c.height = 240;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 320, 240);
            dataUrl = c.toDataURL('image/jpeg', 0.8);
          }
        } catch {
          // fallback
        }
      }

      const nextSamples = [...capturedSamples, dataUrl];
      setCapturedSamples(nextSamples);
      setIsCapturing(false);

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete enrollment!
        finalizeEnrollment();
      }
    }, 400);
  };

  const finalizeEnrollment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const embedding = biometricEngine.generateEmbeddingFromSeed(student.rollNo);
      setIsProcessing(false);
      onEnrollmentComplete(student.id, embedding);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const currentPose = POSES[currentStep] || POSES[0];
  const progressPercent = Math.round(((capturedSamples.length) / 4) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-white relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Biometric Face Registration
              </h2>
              <p className="text-xs text-slate-400">
                Enrolling <strong>{student.name}</strong> ({student.rollNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Pose {currentStep + 1} of 4: <span className="text-indigo-400">{currentPose.title}</span>
          </span>
          <span className="font-mono text-indigo-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Camera Viewport */}
        <div className="p-5 space-y-4">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Oval Face Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 rounded-[50%] border-2 border-dashed border-indigo-400/70 shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300/80 bg-slate-950/60 px-2 py-0.5 rounded-full">
                  Align Face
                </span>
              </div>
            </div>

            {/* Shutter flash */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white opacity-80 animate-pulse pointer-events-none" />
            )}
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center space-x-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <p>{currentPose.instruction}</p>
          </div>

          {/* Captured Samples Row */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map(idx => {
              const sample = capturedSamples[idx];
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl border flex items-center justify-center overflow-hidden relative ${
                    sample ? 'border-emerald-500 bg-slate-950' : idx === currentStep ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 bg-slate-950/40'
                  }`}
                >
                  {sample ? (
                    <>
                      <img src={sample} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-600">#{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-capture-face-sample"
            disabled={isCapturing || isProcessing}
            onClick={captureCurrentPose}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Synthesizing Embedding...'
                : currentStep === 3
                ? 'Capture & Finish 4/4'
                : `Capture Pose ${currentStep + 1}`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
