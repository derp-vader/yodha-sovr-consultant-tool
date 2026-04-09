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
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Sticky Stats */}
        <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col gap-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
          
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sovereignty Report</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Based on EU Cloud Sovereignty Framework</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={resetSimulation}
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Reset Simulation
              </button>
              <button 
                onClick={resetApp}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm shrink-0"
          >
            <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-4">Overall Score</h2>
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="80" cy="80" r="72" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 * (1 - currentResult.totalScore / 100)}
                  className={`${getScoreColor(currentResult.totalScore)} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(currentResult.totalScore)}`}>
                  {currentResult.totalScore}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">/ 100</span>
              </div>
            </div>
            
            {scoreDiff > 0 && (
              <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                +{scoreDiff} points simulated
              </div>
            )}
          </motion.div>

          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
          >
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Dimensions</h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
          >
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Detailed Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentResult.categories.map((cat) => (
                <div key={cat.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300 pr-2 truncate">{cat.name}</h3>
                    <span className={`text-xs font-bold ${getScoreColor(cat.score)}`}>{cat.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBg(cat.score)} transition-all duration-500`}
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  Future Score Simulator
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">Interactive</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Click on any recommendation to see pros/cons and simulate migrating.</p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                <ShieldCheck className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-medium text-emerald-800 dark:text-emerald-300">Excellent Sovereignty!</h3>
                <p className="text-emerald-600 dark:text-emerald-400 mt-2">We couldn't find any major areas for improvement.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {recommendations.map((rec, idx) => {
                  const activeRec = rec.allRecommendations.find((r: Recommendation) => r.recommendedAnswerId === rec.activeSimulationId);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`p-6 rounded-2xl border transition-all ${
                        rec.isSimulated 
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {rec.question.title}
                        </h3>
                        <div className="flex gap-1.5 flex-wrap">
                          {rec.question.categories.map((c: string) => (
                            <span key={c} className="text-[10px] px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm mb-5">
                        <span className={`px-3.5 py-2 rounded-lg ${rec.isSimulated ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 line-through' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-medium'}`}>
                          {rec.originalAnswers.map((a: any) => a.text).join(' + ')}
                        </span>
                        <ArrowRight size={18} className="text-slate-400" />
                        {rec.isSimulated && activeRec ? (
                          <span className="px-3.5 py-2 rounded-lg font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 size={16} />
                            {activeRec.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 italic">Select an alternative below</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {rec.allRecommendations.map((r: Recommendation) => {
                          const isSelected = rec.activeSimulationId === r.recommendedAnswerId;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRec({ questionId: rec.question.id, rec: r })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedRec.rec.name}</h3>
                  <button 
                    onClick={() => setSelectedRec(null)} 
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Why this improves sovereignty</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{selectedRec.rec.reason}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18}/> Pros
                    </h4>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-3">
                      {selectedRec.rec.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="leading-snug">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-xl border border-rose-100 dark:border-rose-800/30">
                    <h4 className="font-semibold text-rose-800 dark:text-rose-400 mb-4 flex items-center gap-2">
                      <XCircle size={18}/> Cons
                    </h4>
                    <ul className="text-sm text-rose-700 dark:text-rose-300 space-y-3">
                      {selectedRec.rec.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="leading-snug">{c}</span>
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
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${
                    simulatedReplacements[selectedRec.questionId] === selectedRec.rec.recommendedAnswerId 
                      ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
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
