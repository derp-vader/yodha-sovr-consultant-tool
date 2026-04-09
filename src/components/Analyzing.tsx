import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { Shield, Server, Lock, Globe } from 'lucide-react';

const steps = [
  { icon: Shield, text: 'Evaluating strategic sovereignty...' },
  { icon: Server, text: 'Analyzing data residency & infrastructure...' },
  { icon: Lock, text: 'Checking security & compliance...' },
  { icon: Globe, text: 'Computing final sovereignty score...' },
];

export function Analyzing() {
  const setStep = useAppStore((state) => state.setStep);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStep('results'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [setStep]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col items-center">
          
          <div className="relative w-24 h-24 mb-8">
            <motion.div 
              className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-8 tracking-tight">Processing Assessment</h2>

          <div className="w-full space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isActive || isPast ? 1 : 0.3,
                    x: isActive || isPast ? 0 : -10
                  }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    isPast ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                    isActive ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                    'bg-white/5 border-white/10 text-slate-500'
                  }`}>
                    <Icon size={14} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isPast ? 'text-slate-300' :
                    isActive ? 'text-white' :
                    'text-slate-500'
                  }`}>
                    {step.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
