'use client';

import { vocabulary } from '@/data/vocabulary';
import { levelInfo } from '@/data/vocabulary';
import { Level, QuizMode, QuizFilter } from '@/types/vocabulary';
import { Trophy, RefreshCw, Home, CheckCircle, XCircle } from 'lucide-react';

interface Result {
  wordId: number;
  correct: boolean;
}

interface Props {
  results: Result[];
  level: Level | 'all';
  mode: QuizMode;
  filter: QuizFilter;
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultScreen({ results, level, mode, filter, onRetry, onHome }: Props) {
  const correctCount = results.filter(r => r.correct).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const wrongResults = results.filter(r => !r.correct);
  const levelLabel = level === 'all' ? '全レベル' : levelInfo[level].label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-xl mx-auto">
        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Trophy size={32} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">結果</h2>
          <div className="text-slate-500 text-sm mb-6">
            {levelLabel} | {mode === 'multiple' ? '4択' : 'タイピング'}
            {filter === 'wrong' ? ' | 復習モード' : ''}
          </div>

          <div className="text-6xl font-bold text-blue-600 mb-2">{pct}%</div>
          <div className="text-slate-500 text-lg mb-6">{correctCount} / {total} 正解</div>

          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {pct >= 80 ? '素晴らしい！' : pct >= 60 ? 'よくできました' : 'もう少し練習しましょう'}
          </div>
        </div>

        {/* Wrong words list */}
        {wrongResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <XCircle size={18} className="text-red-500" />
              間違えた単語 ({wrongResults.length}語) — 記録に追加されました
            </h3>
            <div className="space-y-2">
              {wrongResults.map(r => {
                const word = vocabulary.find(w => w.id === r.wordId);
                if (!word) return null;
                return (
                  <div key={r.wordId} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">{word.word}</span>
                    <span className="text-red-600 text-sm">{word.meaning}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Correct words */}
        {correctCount > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              正解した単語 ({correctCount}語)
            </h3>
            <div className="space-y-2">
              {results.filter(r => r.correct).map(r => {
                const word = vocabulary.find(w => w.id === r.wordId);
                if (!word) return null;
                return (
                  <div key={r.wordId} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">{word.word}</span>
                    <span className="text-green-600 text-sm">{word.meaning}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors"
          >
            <RefreshCw size={18} />
            もう一度
          </button>
          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-3 font-medium transition-colors"
          >
            <Home size={18} />
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}
