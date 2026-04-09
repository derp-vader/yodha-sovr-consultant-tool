import { useState } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function Onboarding() {
  const { setOnboardingData, setStep } = useAppStore();
  const [companyType, setCompanyType] = useState('');
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyType && industry && region) {
      setOnboardingData({ companyType, industry, region });
      setStep('questionnaire');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
            <ShieldCheck size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
          EU Digital Sovereignty Analyzer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">
          Assess your company's digital sovereignty maturity based on the EU Cloud Sovereignty Framework.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Company Type
            </label>
            <select 
              required
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="" disabled>Select type...</option>
              <option value="startup">Startup</option>
              <option value="sme">SME</option>
              <option value="enterprise">Enterprise</option>
              <option value="public">Public Sector</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Industry
            </label>
            <select 
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="" disabled>Select industry...</option>
              <option value="tech">Technology / Software</option>
              <option value="finance">Finance / Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail / E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Region
            </label>
            <select 
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="" disabled>Select region...</option>
              <option value="eu">European Union (EU)</option>
              <option value="non-eu">Non-EU</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-4"
          >
            Start Assessment
          </button>
        </form>
      </motion.div>
    </div>
  );
}
