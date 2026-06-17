'use client';

import { vocabulary, levelInfo } from '@/data/vocabulary';
import { Level } from '@/types/vocabulary';
import { X, Trash2, Home, AlertCircle } from 'lucide-react';

interface Props {
  wrongIds: number[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
  onHome: () => void;
}

export default function WrongListScreen({ wrongIds, onRemove, onClearAll, onHome }: Props) {
  const wrongWords = vocabulary.filter(w => wrongIds.includes(w.id));
  const byLevel = ([1, 2, 3, 4] as Level[]).map(lv => ({
    level: lv,
    words: wrongWords.filter(w => w.level === lv),
  })).filter(g => g.words.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onHome} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm">
            <Home size={16} />
            ホーム
          </button>
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            間違えた単語
          </h2>
          {wrongIds.length > 0 ? (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
            >
              <Trash2 size={14} />
              全削除
            </button>
          ) : <div className="w-16" />}
        </div>

        {wrongIds.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-bold text-slate-700 mb-1">間違えた単語はありません</div>
            <div className="text-slate-400 text-sm">すべて正解です！</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-slate-500 text-center mb-2">
              合計 {wrongIds.length}語 | チェックを外すには右の × をタップ
            </div>
            {byLevel.map(({ level, words }) => {
              const info = levelInfo[level];
              return (
                <div key={level} className={`border ${info.borderColor} ${info.bgColor} rounded-xl overflow-hidden`}>
                  <div className={`px-4 py-2 flex items-center justify-between`}>
                    <span className={`font-bold ${info.textColor}`}>{info.label}</span>
                    <span className={`text-sm ${info.textColor} opacity-70`}>{words.length}語</span>
                  </div>
                  <div className="bg-white divide-y divide-slate-100">
                    {words.map(word => (
                      <div key={word.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <span className="font-medium text-slate-800 mr-3">{word.word}</span>
                          <span className="text-slate-500 text-sm">{word.meaning}</span>
                        </div>
                        <button
                          onClick={() => onRemove(word.id)}
                          className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
                          title="チェックを外す"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
