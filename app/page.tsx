'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import SubscriptionCard from '@/components/SubscriptionCard'
import SubscriptionForm from '@/components/SubscriptionForm'
import SummaryStats from '@/components/SummaryStats'
import { Subscription, Category, CATEGORY_LABELS } from '@/types/subscription'

type SortKey = 'name' | 'price' | 'nextBillingDate'

export default function Home() {
  const { subscriptions, isLoaded, addSubscription, updateSubscription, deleteSubscription } =
    useSubscriptions()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Subscription | undefined>()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('nextBillingDate')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = subscriptions
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.notes.toLowerCase().includes(q) ||
          CATEGORY_LABELS[s.category].includes(q)
      )
    }
    if (filterCategory !== 'all') {
      list = list.filter((s) => s.category === filterCategory)
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name, 'ja')
      if (sortKey === 'price') return b.price - a.price
      return a.nextBillingDate.localeCompare(b.nextBillingDate)
    })
  }, [subscriptions, search, filterCategory, sortKey])

  function handleSave(sub: Omit<Subscription, 'id' | 'nextBillingDate'>) {
    if (editing) {
      updateSubscription(editing.id, sub)
    } else {
      addSubscription(sub)
    }
    setShowForm(false)
    setEditing(undefined)
  }

  function handleEdit(sub: Subscription) {
    setEditing(sub)
    setShowForm(true)
  }

  const categories = Array.from(new Set(subscriptions.map((s) => s.category)))

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-sky-500">サブスク</span>トラッカー
          </h1>
          <button
            onClick={() => {
              setEditing(undefined)
              setShowForm(true)
            }}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
          >
            <Plus size={16} />
            追加
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="gap-6 lg:flex lg:items-start">
          {/* Left: List */}
          <div className="flex-1">
            {/* Search & filter bar */}
            <div className="mb-4 space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="サービス名で検索..."
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    showFilters || filterCategory !== 'all'
                      ? 'border-sky-300 bg-sky-50 text-sky-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  フィルター
                </button>
              </div>

              {showFilters && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setFilterCategory('all')}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        filterCategory === 'all'
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      すべて
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setFilterCategory(filterCategory === cat ? 'all' : cat)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          filterCategory === cat
                            ? 'bg-sky-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">並べ替え:</span>
                    <select
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value as SortKey)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:border-sky-400 focus:outline-none"
                    >
                      <option value="nextBillingDate">次回請求日</option>
                      <option value="price">料金（高い順）</option>
                      <option value="name">名前</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                <p className="text-gray-400">サブスクがありません</p>
                <button
                  onClick={() => {
                    setEditing(undefined)
                    setShowForm(true)
                  }}
                  className="mt-4 flex items-center gap-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
                >
                  <Plus size={16} />
                  追加する
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onEdit={handleEdit}
                    onDelete={deleteSubscription}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Stats (desktop) */}
          <div className="mt-6 w-full lg:mt-0 lg:w-80 lg:shrink-0">
            <SummaryStats subscriptions={subscriptions} />
          </div>
        </div>
      </main>

      {showForm && (
        <SubscriptionForm
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setEditing(undefined)
          }}
          initial={editing}
        />
      )}
    </div>
  )
}
