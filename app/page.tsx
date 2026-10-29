'use client';

import { useState, useCallback } from 'react';
import { Level, QuizMode, QuizFilter, VocabCategory } from '@/types/vocabulary';
import { useWrongIds } from '@/hooks/useQuiz';
import HomeScreen from '@/components/toeic/HomeScreen';
import QuizScreen from '@/components/toeic/QuizScreen';
import ResultScreen from '@/components/toeic/ResultScreen';
import WrongListScreen from '@/components/toeic/WrongListScreen';

type View = 'home' | 'quiz' | 'result' | 'wrong-list';

interface QuizConfig {
  level: Level | 'all';
  mode: QuizMode;
  filter: QuizFilter;
  category: VocabCategory;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [config, setConfig] = useState<QuizConfig>({ level: 1, mode: 'multiple', filter: 'all', category: 'toeic' });
  const [results, setResults] = useState<{ wordId: number; correct: boolean }[]>([]);
  const [quizKey, setQuizKey] = useState(0);
  const { wrongIds, addWrong, removeWrong, clearAllWrong } = useWrongIds();

  const handleStart = useCallback((level: Level | 'all', mode: QuizMode, filter: QuizFilter, category: VocabCategory) => {
    setConfig({ level, mode, filter, category });
    setResults([]);
    setQuizKey(k => k + 1);
    setView('quiz');
  }, []);

  const handleFinish = useCallback((r: { wordId: number; correct: boolean }[]) => {
    setResults(r);
    setView('result');
  }, []);

  const handleRetry = useCallback(() => {
    setResults([]);
    setQuizKey(k => k + 1);
    setView('quiz');
  }, []);

  if (view === 'home') {
    return (
      <HomeScreen
        wrongIds={wrongIds}
        onStart={handleStart}
        onViewWrong={() => setView('wrong-list')}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <QuizScreen
        key={quizKey}
        level={config.level}
        mode={config.mode}
        filter={config.filter}
        category={config.category}
        wrongIds={wrongIds}
        addWrong={addWrong}
        onFinish={handleFinish}
        onHome={() => setView('home')}
      />
    );
  }

  if (view === 'result') {
    return (
      <ResultScreen
        results={results}
        level={config.level}
        mode={config.mode}
        filter={config.filter}
        onRetry={handleRetry}
        onHome={() => setView('home')}
      />
    );
  }

  return (
    <WrongListScreen
      wrongIds={wrongIds}
      onRemove={removeWrong}
      onClearAll={clearAllWrong}
      onHome={() => setView('home')}
    />
  );
}
