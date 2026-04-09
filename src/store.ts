import { create } from 'zustand';
import { QUESTIONS } from './data/questions';

export type AppStep = 'onboarding' | 'questionnaire' | 'analyzing' | 'results';

interface OnboardingData {
  companyType: string;
  industry: string;
  region: string;
}

interface AppState {
  step: AppStep;
  onboardingData: OnboardingData | null;
  answers: Record<string, string[]>; // questionId -> array of answerIds
  simulatedReplacements: Record<string, string>; // questionId -> recommendedAnswerId
  currentQuestionIndex: number;
  
  setStep: (step: AppStep) => void;
  setOnboardingData: (data: OnboardingData) => void;
  toggleAnswer: (questionId: string, answerId: string, multiSelect?: boolean) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setSimulation: (questionId: string, recommendedAnswerId: string | null) => void;
  resetSimulation: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  step: 'onboarding',
  onboardingData: null,
  answers: {},
  simulatedReplacements: {},
  currentQuestionIndex: 0,

  setStep: (step) => set({ step }),
  setOnboardingData: (data) => set({ onboardingData: data }),
  toggleAnswer: (questionId, answerId, multiSelect) => set((state) => {
    const current = state.answers[questionId] || [];
    if (multiSelect) {
      if (current.includes(answerId)) {
        return { answers: { ...state.answers, [questionId]: current.filter(id => id !== answerId) } };
      } else {
        return { answers: { ...state.answers, [questionId]: [...current, answerId] } };
      }
    } else {
      return { answers: { ...state.answers, [questionId]: [answerId] } };
    }
  }),
  nextQuestion: () => set((state) => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      return { currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    return state;
  }),
  prevQuestion: () => set((state) => {
    if (state.currentQuestionIndex > 0) {
      return { currentQuestionIndex: state.currentQuestionIndex - 1 };
    }
    return state;
  }),
  setSimulation: (questionId, recommendedAnswerId) => set((state) => {
    const newSim = { ...state.simulatedReplacements };
    if (recommendedAnswerId === null || newSim[questionId] === recommendedAnswerId) {
      delete newSim[questionId];
    } else {
      newSim[questionId] = recommendedAnswerId;
    }
    return { simulatedReplacements: newSim };
  }),
  resetSimulation: () => set({ simulatedReplacements: {} }),
  resetApp: () => set({
    step: 'onboarding',
    onboardingData: null,
    answers: {},
    simulatedReplacements: {},
    currentQuestionIndex: 0,
  })
}));
