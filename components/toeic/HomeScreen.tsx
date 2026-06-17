'use client';

import { Level, QuizMode, QuizFilter } from '@/types/vocabulary';
import { vocabulary, levelInfo } from '@/data/vocabulary';
import { BookOpen, Keyboard, AlertCircle, Trophy } from 'lucide-react';

interface Props {
  wrongIds: number[];
  onStart: (level: Level | 'all', mode: QuizMode, filter: QuizFilter) => void;
  onViewWrong: () => void;
}

export default function HomeScreen({ wrongIds, onStart, onViewWrong }: Props) {
  const levels: (Level | 'all')[] = ['all', 1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy size={16} />
            TOEIC 英単語アプリ
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">TOEIC Vocabulary</h1>
          <p className="text-slate-500">レベルと出題形式を選んでスタート</p>
        </div>

        {/* Wrong answers banner */}
        {wrongIds.length > 0 && (
          <div
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors"
            onClick={onViewWrong}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-500" size={20} />
              <div>
                <div className="font-medium text-amber-800">間違えた単語</div>
                <div className="text-sm text-amber-600">{wrongIds.length}件 — タップして確認・管理</div>
              </div>
            </div>
            <span className="text-amber-500 text-sm font-medium">管理 →</span>
          </div>
        )}

        {/* Level cards */}
        <div className="space-y-4">
          {/* All levels */}
          <LevelSection
            label="全レベル"
            description="すべての単語を出題"
            count={vocabulary.length}
            wrongCount={wrongIds.length}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
            borderColor="border-purple-300"
            level="all"
            onStart={onStart}
          />

          {([1, 2, 3, 4] as Level[]).map(lv => {
            const info = levelInfo[lv];
            const count = vocabulary.filter(w => w.level === lv).length;
            const wrongCount = vocabulary.filter(w => w.level === lv && wrongIds.includes(w.id)).length;
            return (
              <LevelSection
                key={lv}
                label={info.label}
                description={info.description}
                count={count}
                wrongCount={wrongCount}
                bgColor={info.bgColor}
                textColor={info.textColor}
                borderColor={info.borderColor}
                level={lv}
                onStart={onStart}
              />
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          総単語数 {vocabulary.length}語 | 間違えた単語は自動記録されます
        </p>
      </div>
    </div>
  );
}

interface LevelSectionProps {
  label: string;
  description: string;
  count: number;
  wrongCount: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
  level: Level | 'all';
  onStart: (level: Level | 'all', mode: QuizMode, filter: QuizFilter) => void;
}

function LevelSection({ label, description, count, wrongCount, bgColor, textColor, borderColor, level, onStart }: LevelSectionProps) {
  return (
    <div className={`border ${borderColor} ${bgColor} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`font-bold text-lg ${textColor}`}>{label}</span>
          <span className="text-slate-500 text-sm ml-2">{description}</span>
        </div>
        <span className="text-slate-500 text-sm">{count}語</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onStart(level, 'multiple', 'all')}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors shadow-sm"
        >
          <BookOpen size={16} className="text-blue-500" />
          4択で学習
        </button>
        <button
          onClick={() => onStart(level, 'typing', 'all')}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors shadow-sm"
        >
          <Keyboard size={16} className="text-green-500" />
          タイピング
        </button>
        {wrongCount > 0 && (
          <>
            <button
              onClick={() => onStart(level, 'multiple', 'wrong')}
              className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-700 transition-colors"
            >
              <AlertCircle size={16} />
              間違い4択 ({wrongCount})
            </button>
            <button
              onClick={() => onStart(level, 'typing', 'wrong')}
              className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-700 transition-colors"
            >
              <AlertCircle size={16} />
              間違いタイピング ({wrongCount})
            </button>
          </>
        )}
      </div>
    </div>
  );
}
