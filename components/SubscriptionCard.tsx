'use client'

import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Subscription,
  CATEGORY_LABELS,
  BILLING_CYCLE_LABELS,
  toMonthlyPrice,
} from '@/types/subscription'

interface Props {
  subscription: Subscription
  onEdit: (sub: Subscription) => void
  onDelete: (id: string) => void
}

function formatCurrency(amount: number, currency: string) {
  if (currency === 'JPY') {
    return `¥${Math.round(amount).toLocaleString('ja-JP')}`
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function SubscriptionCard({ subscription: sub, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const days = daysUntil(sub.nextBillingDate)
  const monthlyPrice = toMonthlyPrice(sub.price, sub.billingCycle)

  const urgencyColor =
    days <= 3
      ? 'bg-red-100 text-red-700'
      : days <= 7
      ? 'bg-amber-100 text-amber-700'
      : 'bg-gray-100 text-gray-600'

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: sub.color }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-gray-800">{sub.name}</h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: sub.color }}
              >
                {CATEGORY_LABELS[sub.category]}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {formatCurrency(sub.price, sub.currency)} / {BILLING_CYCLE_LABELS[sub.billingCycle]}
              {sub.billingCycle !== 'monthly' && (
                <span className="ml-1 text-gray-400">
                  (月換算: {formatCurrency(monthlyPrice, sub.currency)})
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => onEdit(sub)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor}`}>
            {days === 0
              ? '今日請求'
              : days < 0
              ? `${Math.abs(days)}日前`
              : `${days}日後に請求`}
          </span>
          <span className="text-xs text-gray-400">{sub.nextBillingDate}</span>
        </div>

        {expanded && (
          <div className="mt-3 border-t pt-3">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">開始日</dt>
                <dd className="text-gray-700">{sub.startDate}</dd>
              </div>
              {sub.notes && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">メモ</dt>
                  <dd className="text-gray-700">{sub.notes}</dd>
                </div>
              )}
            </dl>
            <div className="mt-3 flex justify-end">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">本当に削除しますか？</span>
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  削除
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
