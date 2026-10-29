'use client';

import { useState } from 'react';
import { Level, QuizMode, QuizFilter, VocabCategory } from '@/types/vocabulary';
import { toeicWords, academicWords, levelInfo } from '@/data/vocabulary';
import { academicLevelInfo } from '@/data/academic';
import { BookOpen, Keyboard, AlertCircle, Trophy, GraduationCap, ChevronLeft } from 'lucide-react';

interface Props {
  wrongIds: number[];
  onStart: (level: Level | 'all', mode: QuizMode, filter: QuizFilter, category: VocabCategory) => void;
  onViewWrong: () => void;
}

export default function HomeScreen({ wrongIds, onStart, onViewWrong }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | null>(null);

  if (selectedCategory === null) {
    return <CategorySelect wrongIds={wrongIds} onSelectCategory={setSelectedCategory} onViewWrong={onViewWrong} />;
  }

  return (
    <LevelSelect
      category={selectedCategory}
      wrongIds={wrongIds}
      onStart={onStart}
      onBack={() => setSelectedCategory(null)}
      onViewWrong={onViewWrong}
    />
  );
}

function CategorySelect({ wrongIds, onSelectCategory, onViewWrong }: {
  wrongIds: number[];
  onSelectCategory: (c: VocabCategory) => void;
  onViewWrong: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy size={16} />
            語彙学習アプリ
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Vocabulary Trainer</h1>
          <p className="text-slate-500">カテゴリを選んでください</p>
        </div>

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

        <div className="space-y-4">
          <button
            onClick={() => onSelectCategory('toeic')}
            className="w-full bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-100 text-blue-600 rounded-xl p-3">
                <Trophy size={28} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">TOEIC 英単語</div>
                <div className="text-sm text-slate-500">ビジネス英語 · レベル1〜4</div>
              </div>
            </div>
            <div className="text-slate-400 text-sm">{toeicWords.length}語収録</div>
          </button>

          <button
            onClick={() => onSelectCategory('academic')}
            className="w-full bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-emerald-100 text-emerald-600 rounded-xl p-3">
                <GraduationCap size={28} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">国際学会用語</div>
                <div className="text-sm text-slate-500">アカデミック英語 · レベル1〜4</div>
              </div>
            </div>
            <div className="text-slate-400 text-sm">{academicWords.length}語収録</div>
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          総単語数 {toeicWords.length + academicWords.length}語 | 間違えた単語は自動記録されます
        </p>
      </div>
    </div>
  );
}

function LevelSelect({ category, wrongIds, onStart, onBack, onViewWrong }: {
  category: VocabCategory;
  wrongIds: number[];
  onStart: (level: Level | 'all', mode: QuizMode, filter: QuizFilter, category: VocabCategory) => void;
  onBack: () => void;
  onViewWrong: () => void;
}) {
  const words = category === 'toeic' ? toeicWords : academicWords;
  const lInfo = category === 'academic' ? academicLevelInfo : levelInfo;
  const title = category === 'toeic' ? 'TOEIC 英単語' : '国際学会用語';
  const accentColor = category === 'toeic' ? 'bg-blue-600' : 'bg-emerald-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="py-6">
          <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-4">
            <ChevronLeft size={16} /> カテゴリ選択に戻る
          </button>
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 ${accentColor} text-white px-4 py-2 rounded-full text-sm font-medium mb-2`}>
              {category === 'toeic' ? <Trophy size={16} /> : <GraduationCap size={16} />}
              {title}
            </div>
            <p className="text-slate-500">レベルと出題形式を選んでスタート</p>
          </div>
        </div>

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

        <div className="space-y-4">
          <LevelSection
            label="全レベル"
            description="すべての単語を出題"
            count={words.length}
            wrongCount={wrongIds.filter(id => words.some(w => w.id === id)).length}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
            borderColor="border-purple-300"
            level="all"
            category={category}
            onStart={onStart}
          />

          {([1, 2, 3, 4] as Level[]).map(lv => {
            const info = lInfo[lv];
            const lvWords = words.filter(w => w.level === lv);
            const wrongCount = lvWords.filter(w => wrongIds.includes(w.id)).length;
            return (
              <LevelSection
                key={lv}
                label={info.label}
                description={info.description}
                count={lvWords.length}
                wrongCount={wrongCount}
                bgColor={info.bgColor}
                textColor={info.textColor}
                borderColor={info.borderColor}
                level={lv}
                category={category}
                onStart={onStart}
              />
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          {words.length}語 | 間違えた単語は自動記録されます
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
  category: VocabCategory;
  onStart: (level: Level | 'all', mode: QuizMode, filter: QuizFilter, category: VocabCategory) => void;
}

function LevelSection({ label, description, count, wrongCount, bgColor, textColor, borderColor, level, category, onStart }: LevelSectionProps) {
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
          onClick={() => onStart(level, 'multiple', 'all', category)}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors shadow-sm"
        >
          <BookOpen size={16} className="text-blue-500" />
          4択で学習
        </button>
        <button
          onClick={() => onStart(level, 'typing', 'all', category)}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors shadow-sm"
        >
          <Keyboard size={16} className="text-green-500" />
          タイピング
        </button>
        {wrongCount > 0 && (
          <>
            <button
              onClick={() => onStart(level, 'multiple', 'wrong', category)}
              className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-700 transition-colors"
            >
              <AlertCircle size={16} />
              間違い4択 ({wrongCount})
            </button>
            <button
              onClick={() => onStart(level, 'typing', 'wrong', category)}
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
