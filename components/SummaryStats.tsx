'use client'

import { Subscription, toMonthlyPrice, CATEGORY_LABELS, CATEGORY_COLORS, Category } from '@/types/subscription'

interface Props {
  subscriptions: Subscription[]
}

function formatJPY(amount: number) {
  return `¥${Math.round(amount).toLocaleString('ja-JP')}`
}

export default function SummaryStats({ subscriptions }: Props) {
  const active = subscriptions.filter((s) => s.isActive)

  const monthlyTotal = active.reduce((sum, s) => {
    if (s.currency !== 'JPY') return sum
    return sum + toMonthlyPrice(s.price, s.billingCycle)
  }, 0)

  const yearlyTotal = monthlyTotal * 12

  // カテゴリ別集計
  const byCategory = active.reduce<Record<string, number>>((acc, s) => {
    if (s.currency !== 'JPY') return acc
    const monthly = toMonthlyPrice(s.price, s.billingCycle)
    acc[s.category] = (acc[s.category] ?? 0) + monthly
    return acc
  }, {})

  const sortedCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  // 次の7日以内の請求
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const soon = active.filter((s) => {
    const d = new Date(s.nextBillingDate)
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 7
  })

  return (
    <div className="space-y-4">
      {/* 合計カード */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-white shadow-lg">
        <p className="text-sm font-medium opacity-80">月額合計 (JPY)</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">{formatJPY(monthlyTotal)}</p>
        <p className="mt-1 text-sm opacity-70">年額: {formatJPY(yearlyTotal)}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            {active.length} 件のサブスク
          </span>
        </div>
      </div>

      {/* カテゴリ内訳 */}
      {sortedCategories.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">カテゴリ別内訳</h3>
          <div className="space-y-2">
            {sortedCategories.map(([cat, amount]) => {
              const pct = monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0
              const color = CATEGORY_COLORS[cat as Category]
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-600">{CATEGORY_LABELS[cat as Category]}</span>
                    <span className="font-medium text-gray-800">{formatJPY(amount)}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 直近の請求 */}
      {soon.length > 0 && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">7日以内の請求</h3>
          <ul className="space-y-1">
            {soon.map((s) => {
              const days = Math.ceil(
                (new Date(s.nextBillingDate).getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              return (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-amber-700">{s.name}</span>
                  <span className="text-amber-600">
                    {days === 0 ? '今日' : `${days}日後`} —{' '}
                    {s.currency === 'JPY'
                      ? formatJPY(s.price)
                      : `${s.price} ${s.currency}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
