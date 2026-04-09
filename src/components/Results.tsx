import { useState } from 'react';
import { useAppStore } from '../store';
import { calculateScore } from '../lib/scoring';
import { QUESTIONS, Recommendation } from '../data/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { RefreshCw, ArrowRight, ShieldCheck, CheckCircle2, X, XCircle } from 'lucide-react';

export function Results() {
  const { answers, simulatedReplacements, setSimulation, resetSimulation, resetApp } = useAppStore();
  const [selectedRec, setSelectedRec] = useState<{questionId: string, rec: Recommendation} | null>(null);
  
  const baseResult = calculateScore(answers, {});
  const currentResult = calculateScore(answers, simulatedReplacements);
  
  const scoreDiff = currentResult.totalScore - baseResult.totalScore;

  // Find recommendations based on original answers
  const recommendations = QUESTIONS.map(q => {
    const answerIds = answers[q.id] || [];
    const selectedAnswers = answerIds.map(id => q.answers.find(a => a.id === id)).filter(Boolean);
    
    const answersWithRecs = selectedAnswers.filter(a => a && a.score < 4 && a.recommendations && a.recommendations.length > 0);
    
    if (answersWithRecs.length > 0) {
      // Collect all unique recommendations from all selected answers
      const allRecs = new Map();
      answersWithRecs.forEach(a => {
        a!.recommendations!.forEach(r => {
          if (!allRecs.has(r.id)) {
            allRecs.set(r.id, r);
          }
        });
      });

      return {
        question: q,
        originalAnswers: answersWithRecs,
        allRecommendations: Array.from(allRecs.values()),
        isSimulated: !!simulatedReplacements[q.id],
        activeSimulationId: simulatedReplacements[q.id]
      };
    }
    return null;
  }).filter(Boolean) as any[];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const radarData = currentResult.categories.map(c => ({
    subject: c.name.split(' ')[0], // Shorten for radar
    A: c.score,
    fullMark: 100,
  }));

  return (
    <div className="flex-1 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Sticky Stats */}
        <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col gap-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
          
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Sovereignty Report</h1>
              <p className="text-slate-400 mt-1 text-sm">Based on EU Cloud Sovereignty Framework</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={resetApp}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                <RefreshCw size={16} />
                Retake
              </button>
            </div>
          </div>

          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl shrink-0 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6 relative z-10">Overall Score</h2>
            <div className="relative z-10">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle 
                  cx="96" cy="96" r="86" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 86}
                  strokeDashoffset={2 * Math.PI * 86 * (1 - currentResult.totalScore / 100)}
                  strokeLinecap="round"
                  className={`${getScoreColor(currentResult.totalScore)} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(currentResult.totalScore)}`}>
                  {currentResult.totalScore}
                </span>
                <span className="text-sm text-slate-500 mt-1 font-medium">/ 100</span>
              </div>
            </div>
            
            {scoreDiff > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(52,211,153,0.1)]"
              >
                <ArrowRight size={14} />
                +{scoreDiff} points simulated
              </motion.div>
            )}
          </motion.div>

          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shrink-0"
          >
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Dimensions</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shrink-0"
          >
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-5">Detailed Breakdown</h2>
            <div className="grid grid-cols-1 gap-4">
              {currentResult.categories.map((cat) => (
                <div key={cat.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{cat.name}</h3>
                    <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>{cat.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBg(cat.score)} transition-all duration-500 shadow-[0_0_10px_currentColor]`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                  Gaps Identified
                  <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">Interactive</span>
                </h2>
                <p className="text-slate-400 mt-2 text-sm">Click on any recommendation to see pros/cons and simulate migrating.</p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-20 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                <ShieldCheck className="mx-auto h-16 w-16 text-emerald-400 mb-6" strokeWidth={1.5} />
                <h3 className="text-2xl font-semibold text-emerald-300 tracking-tight">Excellent Sovereignty!</h3>
                <p className="text-emerald-400/80 mt-2">We couldn't find any major areas for improvement.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec, idx) => {
                  const activeRec = rec.allRecommendations.find((r: Recommendation) => r.recommendedAnswerId === rec.activeSimulationId);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
                        rec.isSimulated 
                          ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <h3 className="text-lg font-semibold text-white leading-snug">
                          {rec.question.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap shrink-0">
                          {rec.question.categories.map((c: string) => (
                            <span key={c} className="text-[10px] px-2.5 py-1 bg-white/10 text-slate-300 rounded-full font-medium tracking-wide">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
                        <span className={`px-4 py-2 rounded-xl transition-colors ${rec.isSimulated ? 'bg-white/5 text-slate-500 line-through' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium'}`}>
                          {rec.originalAnswers.map((a: any) => a.text).join(' + ')}
                        </span>
                        <ArrowRight size={16} className="text-slate-500" />
                        {rec.isSimulated && activeRec ? (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 rounded-xl font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                          >
                            <CheckCircle2 size={16} />
                            {activeRec.name}
                          </motion.span>
                        ) : (
                          <span className="text-slate-500 italic">Select an alternative below</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {rec.allRecommendations.map((r: Recommendation) => {
                          const isSelected = rec.activeSimulationId === r.recommendedAnswerId;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRec({ questionId: rec.question.id, rec: r })}
                              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-blue-500/50 hover:bg-white/10'
                              }`}
                            >
                              {r.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

      </div>

      {/* Modal for Recommendation Details */}
      <AnimatePresence>
        {selectedRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/10"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedRec.rec.name}</h3>
                  <button 
                    onClick={() => setSelectedRec(null)} 
                    className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mb-10">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Why this improves sovereignty</h4>
                  <p className="text-slate-300 leading-relaxed text-lg">{selectedRec.rec.reason}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 mb-5 flex items-center gap-2">
                      <CheckCircle2 size={18}/> Pros
                    </h4>
                    <ul className="text-sm text-emerald-200/80 space-y-4">
                      {selectedRec.rec.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-500/5 p-6 rounded-2xl border border-rose-500/20">
                    <h4 className="font-semibold text-rose-400 mb-5 flex items-center gap-2">
                      <XCircle size={18}/> Cons
                    </h4>
                    <ul className="text-sm text-rose-200/80 space-y-4">
                      {selectedRec.rec.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSimulation(selectedRec.questionId, selectedRec.rec.recommendedAnswerId);
                    setSelectedRec(null);
                  }}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${
                    simulatedReplacements[selectedRec.questionId] === selectedRec.rec.recommendedAnswerId 
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  {simulatedReplacements[selectedRec.questionId] === selectedRec.rec.recommendedAnswerId ? (
                    <>
                      <X size={20} />
                      Remove from Simulation
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Simulate this choice
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
