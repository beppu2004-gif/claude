'use client';

import { useEffect, useRef } from 'react';
import { QuizMode, QuizFilter, Level, Word } from '@/types/vocabulary';
import { useQuiz } from '@/hooks/useQuiz';
import { levelInfo } from '@/data/vocabulary';
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

interface Props {
  level: Level | 'all';
  mode: QuizMode;
  filter: QuizFilter;
  wrongIds: number[];
  addWrong: (id: number) => void;
  onFinish: (results: { wordId: number; correct: boolean }[]) => void;
  onHome: () => void;
}

export default function QuizScreen({ level, mode, filter, wrongIds, addWrong, onFinish, onHome }: Props) {
  const { session, current, submitMultiple, submitTyping, setTypingInput, next } = useQuiz(
    level, mode, filter, wrongIds, addWrong
  );
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  useEffect(() => {
    if (session.isFinished) {
      onFinish(session.results);
    }
  }, [session.isFinished, session.results, onFinish]);

  useEffect(() => {
    if (mode === 'typing' && !session.answered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [session.currentIndex, mode, session.answered]);

  if (!current) return null;

  const levelLabel = level === 'all' ? '全レベル' : levelInfo[level].label;
  const progress = session.words.length > 0 ? ((session.currentIndex) / session.words.length) * 100 : 0;
  const isWrongMode = filter === 'wrong';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onHome} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm">
            <Home size={16} />
            ホーム
          </button>
          <div className="text-sm text-slate-500">
            {isWrongMode && <span className="text-amber-600 font-medium mr-2">復習モード</span>}
            {levelLabel} | {mode === 'multiple' ? '4択' : 'タイピング'}
          </div>
          <div className="text-sm text-slate-500">
            {session.currentIndex + 1} / {session.words.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
            {mode === 'multiple' ? '英単語の意味を選んでください' : '日本語の意味に対応する英単語を入力してください'}
          </div>
          <div className="text-center py-4">
            {mode === 'multiple' ? (
              <>
                <div className="text-3xl font-bold text-slate-800 mb-2">{current.word}</div>
                <LevelBadge level={current.level} />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-800 mb-2">{current.meaning}</div>
                <LevelBadge level={current.level} />
              </>
            )}
          </div>

          {current.exampleEn && session.answered && (
            <div className="mt-4 bg-slate-50 rounded-xl p-3">
              <div className="text-sm text-slate-600 italic mb-1">{current.exampleEn}</div>
              <div className="text-sm text-slate-500">{current.exampleJp}</div>
            </div>
          )}
        </div>

        {/* Answer area */}
        {mode === 'multiple' ? (
          <MultipleChoiceArea
            choices={session.choices}
            correctId={current.id}
            selectedId={session.selectedId}
            answered={session.answered}
            onSelect={submitMultiple}
          />
        ) : (
          <TypingArea
            input={session.typingInput}
            result={session.typingResult}
            answered={session.answered}
            correctWord={current.word}
            inputRef={inputRef}
            onChange={setTypingInput}
            onSubmit={submitTyping}
          />
        )}

        {/* Next button */}
        {session.answered && (
          <button
            onClick={next}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors"
          >
            {session.currentIndex + 1 >= session.words.length ? '結果を見る' : '次の問題'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: Level }) {
  const info = levelInfo[level];
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full text-white ${info.badgeColor}`}>
      {info.label} {info.description}
    </span>
  );
}

interface MultipleChoiceAreaProps {
  choices: Word[];
  correctId: number;
  selectedId: number | null;
  answered: boolean;
  onSelect: (id: number) => void;
}

function MultipleChoiceArea({ choices, correctId, selectedId, answered, onSelect }: MultipleChoiceAreaProps) {
  return (
    <div className="space-y-3">
      {choices.map(choice => {
        const isSelected = choice.id === selectedId;
        const isCorrect = choice.id === correctId;

        let btnClass = 'w-full text-left p-4 rounded-xl border transition-all ';
        if (!answered) {
          btnClass += 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
        } else if (isCorrect) {
          btnClass += 'bg-green-50 border-green-400 text-green-800';
        } else if (isSelected && !isCorrect) {
          btnClass += 'bg-red-50 border-red-400 text-red-800';
        } else {
          btnClass += 'bg-white border-slate-200 opacity-60';
        }

        return (
          <button
            key={choice.id}
            className={btnClass}
            onClick={() => !answered && onSelect(choice.id)}
            disabled={answered}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{choice.meaning}</span>
              {answered && isCorrect && <CheckCircle size={18} className="text-green-500 shrink-0" />}
              {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface TypingAreaProps {
  input: string;
  result: 'correct' | 'wrong' | null;
  answered: boolean;
  correctWord: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

function TypingArea({ input, result, answered, correctWord, inputRef, onChange, onSubmit }: TypingAreaProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !answered) onSubmit();
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={answered}
          placeholder="英単語を入力..."
          className={`flex-1 border rounded-xl px-4 py-3 text-lg font-medium outline-none transition-colors
            ${answered
              ? result === 'correct'
                ? 'border-green-400 bg-green-50 text-green-800'
                : 'border-red-400 bg-red-50 text-red-800'
              : 'border-slate-300 focus:border-blue-400 bg-white'
            }`}
        />
        {!answered && (
          <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-medium transition-colors"
          >
            確認
          </button>
        )}
      </div>

      {answered && (
        <div className={`mt-3 flex items-center gap-2 p-3 rounded-xl ${result === 'correct' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result === 'correct' ? (
            <>
              <CheckCircle size={20} className="text-green-500 shrink-0" />
              <span className="font-medium">正解！</span>
            </>
          ) : (
            <>
              <XCircle size={20} className="text-red-500 shrink-0" />
              <span>不正解。正解は <strong>{correctWord}</strong></span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
