import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { Shield, Database, Lock, Globe } from 'lucide-react';

const STEPS = [
  { text: 'Evaluating legal exposure...', icon: Globe },
  { text: 'Analyzing data sovereignty...', icon: Database },
  { text: 'Computing resilience score...', icon: Shield },
  { text: 'Generating recommendations...', icon: Lock },
];

export function Analyzing() {
  const { setStep } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStep('results'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [setStep]);

  const Icon = STEPS[currentStep].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <motion.div
          key={currentStep}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full text-blue-600 dark:text-blue-400">
            <Icon size={48} className="animate-pulse" />
          </div>
        </motion.div>
        
        <div className="h-8 overflow-hidden">
          <motion.p
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-medium text-slate-700 dark:text-slate-300"
          >
            {STEPS[currentStep].text}
          </motion.p>
        </div>
        
        <div className="mt-8 flex justify-center space-x-2">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
