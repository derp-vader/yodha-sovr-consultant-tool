import { useAppStore } from '../store';
import { QUESTIONS } from '../data/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CircleDot, HelpCircle } from 'lucide-react';

export function Questionnaire() {
  const { currentQuestionIndex, answers, toggleAnswer, nextQuestion, prevQuestion, setStep } = useAppStore();
  
  const question = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const isLast = currentQuestionIndex === QUESTIONS.length - 1;
  const answerIds = answers[question.id] || [];
  const hasAnswered = answerIds.length > 0;

  const handleNext = () => {
    if (isLast) {
      setStep('analyzing');
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header & Progress */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-400">
            Question <span className="text-white">{currentQuestionIndex + 1}</span> of {QUESTIONS.length}
          </div>
          <button 
            onClick={() => setStep('onboarding')}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Exit
          </button>
        </div>
        <div className="h-0.5 w-full bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">
              {question.title}
            </h2>
            <p className="text-slate-400 mb-10 text-lg">
              {question.multiSelect ? 'Select all that apply.' : 'Select one option.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.answers.map((answer) => {
                const isSelected = answerIds.includes(answer.id);
                const Icon = answer.icon || HelpCircle;
                
                return (
                  <button
                    key={answer.id}
                    onClick={() => toggleAnswer(question.id, answer.id, question.multiSelect)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                      isSelected 
                        ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3 rounded-xl transition-colors duration-200 ${
                        isSelected 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-white/5 text-slate-400 group-hover:text-slate-300'
                      }`}>
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <span className={`text-lg font-medium transition-colors duration-200 ${
                        isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {answer.text}
                      </span>
                    </div>
                    
                    <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border transition-colors duration-200 relative z-10 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-white/20 bg-black/20'
                    } ${!question.multiSelect && 'rounded-full'}`}>
                      {isSelected && (
                        question.multiSelect 
                          ? <Check size={16} className="text-white" strokeWidth={3} />
                          : <CircleDot size={12} className="text-white fill-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="flex items-center space-x-2 px-8 py-3.5 bg-white text-black hover:bg-slate-200 rounded-xl disabled:opacity-50 disabled:hover:bg-white transition-all font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span>{isLast ? 'Analyze Results' : 'Next'}</span>
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </main>
    </div>
  );
}
