import { toeicWords } from './toeic';
import { academicWords } from './academic';

export { toeicWords } from './toeic';
export { academicWords } from './academic';
export { toeicLevelInfo } from './toeic';
export { academicLevelInfo } from './academic';

export const vocabulary = [...toeicWords, ...academicWords];

export const levelInfo = {
  1: { label: 'Level 1', description: 'TOEIC ~400', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300', badgeColor: 'bg-green-500' },
  2: { label: 'Level 2', description: 'TOEIC ~500-600', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300', badgeColor: 'bg-blue-500' },
  3: { label: 'Level 3', description: 'TOEIC ~600-730', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300', badgeColor: 'bg-orange-500' },
  4: { label: 'Level 4', description: 'TOEIC ~730+', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300', badgeColor: 'bg-red-500' },
} as const;
