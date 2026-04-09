import { CATEGORIES, CategoryId, QUESTIONS } from '../data/questions';

export interface CategoryScore {
  id: CategoryId;
  name: string;
  score: number; // 0-100
  maxScore: number; // 100
  weight: number;
}

export interface ScoringResult {
  totalScore: number; // 0-100
  categories: CategoryScore[];
}

export function calculateScore(
  answers: Record<string, string[]>,
  simulatedReplacements: Record<string, string> = {}
): ScoringResult {
  const categoryTotals: Record<CategoryId, { earned: number; possible: number }> = {
    'SOV-1': { earned: 0, possible: 0 },
    'SOV-2': { earned: 0, possible: 0 },
    'SOV-3': { earned: 0, possible: 0 },
    'SOV-4': { earned: 0, possible: 0 },
    'SOV-5': { earned: 0, possible: 0 },
    'SOV-6': { earned: 0, possible: 0 },
    'SOV-7': { earned: 0, possible: 0 },
    'SOV-8': { earned: 0, possible: 0 },
  };

  QUESTIONS.forEach(q => {
    let answerIds = answers[q.id] || [];
    if (answerIds.length === 0) return;

    // Apply simulation if toggled
    if (simulatedReplacements[q.id]) {
      answerIds = [simulatedReplacements[q.id]];
    }

    const selectedAnswers = answerIds.map(id => q.answers.find(a => a.id === id)).filter(Boolean);
    if (selectedAnswers.length === 0) return;

    // Average the score if multiple are selected
    const avgScore = selectedAnswers.reduce((sum, a) => sum + a!.score, 0) / selectedAnswers.length;

    q.categories.forEach(catId => {
      categoryTotals[catId].earned += avgScore;
      categoryTotals[catId].possible += 4; // Max score per question is 4
    });
  });

  let totalWeightedScore = 0;
  const categoryScores: CategoryScore[] = [];

  (Object.keys(CATEGORIES) as CategoryId[]).forEach(catId => {
    const cat = CATEGORIES[catId];
    const totals = categoryTotals[catId];
    
    let normalizedScore = 0;
    if (totals.possible > 0) {
      normalizedScore = (totals.earned / totals.possible) * 100;
    }

    categoryScores.push({
      id: catId,
      name: cat.name,
      score: Math.round(normalizedScore),
      maxScore: 100,
      weight: cat.weight
    });

    totalWeightedScore += normalizedScore * cat.weight;
  });

  return {
    totalScore: Math.round(totalWeightedScore),
    categories: categoryScores
  };
}
