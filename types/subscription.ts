export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly'

export type Category =
  | 'entertainment'
  | 'music'
  | 'video'
  | 'software'
  | 'cloud'
  | 'news'
  | 'fitness'
  | 'food'
  | 'shopping'
  | 'other'

export interface Subscription {
  id: string
  name: string
  price: number
  currency: 'JPY' | 'USD' | 'EUR'
  billingCycle: BillingCycle
  startDate: string
  nextBillingDate: string
  category: Category
  notes: string
  color: string
  isActive: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
  entertainment: 'エンタメ',
  music: '音楽',
  video: '動画',
  software: 'ソフトウェア',
  cloud: 'クラウド',
  news: 'ニュース',
  fitness: 'フィットネス',
  food: 'フード',
  shopping: 'ショッピング',
  other: 'その他',
}

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: '週払い',
  monthly: '月払い',
  quarterly: '四半期払い',
  yearly: '年払い',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  entertainment: '#8b5cf6',
  music: '#ec4899',
  video: '#ef4444',
  software: '#3b82f6',
  cloud: '#06b6d4',
  news: '#f59e0b',
  fitness: '#10b981',
  food: '#f97316',
  shopping: '#84cc16',
  other: '#6b7280',
}

export function toMonthlyPrice(price: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return price * 4.33
    case 'monthly':
      return price
    case 'quarterly':
      return price / 3
    case 'yearly':
      return price / 12
  }
}

export function calculateNextBillingDate(startDate: string, cycle: BillingCycle): string {
  const today = new Date()
  let date = new Date(startDate)

  while (date <= today) {
    switch (cycle) {
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'quarterly':
        date.setMonth(date.getMonth() + 3)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1)
        break
    }
  }

  return date.toISOString().split('T')[0]
}
