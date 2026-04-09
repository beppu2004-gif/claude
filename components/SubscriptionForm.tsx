'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  Subscription,
  Category,
  BillingCycle,
  CATEGORY_LABELS,
  BILLING_CYCLE_LABELS,
  CATEGORY_COLORS,
} from '@/types/subscription'

interface Props {
  onSave: (sub: Omit<Subscription, 'id' | 'nextBillingDate'>) => void
  onClose: () => void
  initial?: Subscription
}

const defaultForm = {
  name: '',
  price: '',
  currency: 'JPY' as const,
  billingCycle: 'monthly' as BillingCycle,
  startDate: new Date().toISOString().split('T')[0],
  category: 'other' as Category,
  notes: '',
  color: CATEGORY_COLORS['other'],
  isActive: true,
}

export default function SubscriptionForm({ onSave, onClose, initial }: Props) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        price: String(initial.price),
        currency: initial.currency,
        billingCycle: initial.billingCycle,
        startDate: initial.startDate,
        category: initial.category,
        notes: initial.notes,
        color: initial.color,
        isActive: initial.isActive,
      })
    }
  }, [initial])

  function handleCategoryChange(cat: Category) {
    setForm((f) => ({ ...f, category: cat, color: CATEGORY_COLORS[cat] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(form.price)
    if (!form.name || isNaN(price) || price <= 0) return
    onSave({
      name: form.name,
      price,
      currency: form.currency,
      billingCycle: form.billingCycle,
      startDate: form.startDate,
      category: form.category,
      notes: form.notes,
      color: CATEGORY_COLORS[form.category],
      isActive: form.isActive,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initial ? 'サブスクを編集' : 'サブスクを追加'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">サービス名 *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例: Netflix, Spotify..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Price + Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">料金 *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block text-sm font-medium text-gray-700">通貨</label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    currency: e.target.value as 'JPY' | 'USD' | 'EUR',
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="JPY">JPY (円)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">支払いサイクル</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(BILLING_CYCLE_LABELS) as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, billingCycle: cycle }))}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    form.billingCycle === cycle
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {BILLING_CYCLE_LABELS[cycle]}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">開始日</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">カテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.category === cat
                      ? 'border-transparent text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  style={
                    form.category === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}
                  }
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">メモ</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="プラン名など..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600"
            >
              {initial ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
