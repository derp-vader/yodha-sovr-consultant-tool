import React, { useState } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Building2, Globe2, Briefcase } from 'lucide-react';

export function Onboarding() {
  const { setOnboardingData, setStep } = useAppStore();
  const [formData, setFormData] = useState({
    companyType: '',
    industry: '',
    region: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingData(formData);
    setStep('questionnaire');
  };

  const isComplete = formData.companyType && formData.industry && formData.region;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 shadow-inner">
              <Shield className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
            SOVR
          </h1>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Assess your Client's digital sovereignty maturity based on the EU Cloud Sovereignty Framework.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Company Type</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={formData.companyType}
                  onChange={e => setFormData({...formData, companyType: e.target.value})}
                  required
                >
                  <option value="" disabled className="bg-slate-900">Select type...</option>
                  <option value="startup" className="bg-slate-900">Startup / Scale-up</option>
                  <option value="sme" className="bg-slate-900">SME</option>
                  <option value="enterprise" className="bg-slate-900">Enterprise</option>
                  <option value="public" className="bg-slate-900">Public Sector</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Industry</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  required
                >
                  <option value="" disabled className="bg-slate-900">Select industry...</option>
                  <option value="tech" className="bg-slate-900">Technology & Software</option>
                  <option value="finance" className="bg-slate-900">Finance & Banking</option>
                  <option value="healthcare" className="bg-slate-900">Healthcare</option>
                  <option value="manufacturing" className="bg-slate-900">Manufacturing</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Region</label>
              <div className="relative">
                <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                  required
                >
                  <option value="" disabled className="bg-slate-900">Select region...</option>
                  <option value="eu" className="bg-slate-900">European Union (EU)</option>
                  <option value="uk" className="bg-slate-900">United Kingdom</option>
                  <option value="us" className="bg-slate-900">United States</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!isComplete}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              <span>Start Assessment</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
