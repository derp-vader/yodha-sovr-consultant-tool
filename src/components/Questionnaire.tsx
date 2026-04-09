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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header & Progress */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </div>
          <button 
            onClick={() => setStep('onboarding')}
            className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Exit
          </button>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {question.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
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
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400'
                      }`}>
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <span className={`text-lg font-medium transition-colors ${
                        isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {answer.text}
                      </span>
                    </div>
                    
                    <div className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border-2 transition-colors ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-slate-300 dark:border-slate-600'
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
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="flex items-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors font-semibold text-lg"
          >
            <span>{isLast ? 'Analyze Results' : 'Next'}</span>
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </main>
    </div>
  );
}
