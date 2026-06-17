'use client';

import { useState, useEffect, useCallback } from 'react';
import { vocabulary } from '@/data/vocabulary';
import { Level, QuizMode, QuizFilter, Word } from '@/types/vocabulary';

const WRONG_IDS_KEY = 'toeic-wrong-ids';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getChoices(correct: Word, pool: Word[]): Word[] {
  const others = shuffle(pool.filter(w => w.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export function useWrongIds() {
  const [wrongIds, setWrongIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WRONG_IDS_KEY);
      if (stored) setWrongIds(JSON.parse(stored));
    } catch {}
  }, []);

  const addWrong = useCallback((id: number) => {
    setWrongIds(prev => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(WRONG_IDS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeWrong = useCallback((id: number) => {
    setWrongIds(prev => {
      const next = prev.filter(x => x !== id);
      localStorage.setItem(WRONG_IDS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAllWrong = useCallback(() => {
    setWrongIds([]);
    localStorage.removeItem(WRONG_IDS_KEY);
  }, []);

  return { wrongIds, addWrong, removeWrong, clearAllWrong };
}

export interface QuizSession {
  words: Word[];
  currentIndex: number;
  choices: Word[];
  answered: boolean;
  selectedId: number | null;
  typingInput: string;
  typingResult: 'correct' | 'wrong' | null;
  results: { wordId: number; correct: boolean }[];
  mode: QuizMode;
  isFinished: boolean;
}

export function useQuiz(
  level: Level | 'all',
  mode: QuizMode,
  filter: QuizFilter,
  wrongIds: number[],
  addWrong: (id: number) => void,
) {
  const buildWords = useCallback(() => {
    let pool = level === 'all' ? vocabulary : vocabulary.filter(w => w.level === level);
    if (filter === 'wrong') pool = pool.filter(w => wrongIds.includes(w.id));
    return shuffle(pool);
  }, [level, filter, wrongIds]);

  const [session, setSession] = useState<QuizSession>(() => {
    const words = buildWords();
    return {
      words,
      currentIndex: 0,
      choices: words.length > 0 ? getChoices(words[0], vocabulary.filter(w => w.level === words[0].level)) : [],
      answered: false,
      selectedId: null,
      typingInput: '',
      typingResult: null,
      results: [],
      mode,
      isFinished: words.length === 0,
    };
  });

  const current = session.words[session.currentIndex];

  const submitMultiple = useCallback((choiceId: number) => {
    if (session.answered || !current) return;
    const correct = choiceId === current.id;
    if (!correct) addWrong(current.id);
    setSession(s => ({
      ...s,
      answered: true,
      selectedId: choiceId,
      results: [...s.results, { wordId: current.id, correct }],
    }));
  }, [session.answered, current, addWrong]);

  const submitTyping = useCallback(() => {
    if (session.answered || !current) return;
    const input = session.typingInput.trim().toLowerCase();
    const correct = input === current.word.toLowerCase();
    if (!correct) addWrong(current.id);
    setSession(s => ({
      ...s,
      answered: true,
      typingResult: correct ? 'correct' : 'wrong',
      results: [...s.results, { wordId: current.id, correct }],
    }));
  }, [session.answered, session.typingInput, current, addWrong]);

  const setTypingInput = useCallback((val: string) => {
    setSession(s => ({ ...s, typingInput: val }));
  }, []);

  const next = useCallback(() => {
    setSession(s => {
      const nextIdx = s.currentIndex + 1;
      if (nextIdx >= s.words.length) return { ...s, isFinished: true };
      const nextWord = s.words[nextIdx];
      return {
        ...s,
        currentIndex: nextIdx,
        choices: getChoices(nextWord, vocabulary.filter(w => w.level === nextWord.level)),
        answered: false,
        selectedId: null,
        typingInput: '',
        typingResult: null,
      };
    });
  }, []);

  const restart = useCallback(() => {
    const words = buildWords();
    setSession({
      words,
      currentIndex: 0,
      choices: words.length > 0 ? getChoices(words[0], vocabulary.filter(w => w.level === words[0].level)) : [],
      answered: false,
      selectedId: null,
      typingInput: '',
      typingResult: null,
      results: [],
      mode,
      isFinished: words.length === 0,
    });
  }, [buildWords, mode]);

  return { session, current, submitMultiple, submitTyping, setTypingInput, next, restart };
}
