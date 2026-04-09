import { useState, useEffect, useCallback } from 'react'
import { Subscription, calculateNextBillingDate } from '@/types/subscription'

const STORAGE_KEY = 'subscription-tracker-data'

const SAMPLE_DATA: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    price: 1490,
    currency: 'JPY',
    billingCycle: 'monthly',
    startDate: '2023-01-15',
    nextBillingDate: '2026-05-15',
    category: 'video',
    notes: 'スタンダードプラン',
    color: '#ef4444',
    isActive: true,
  },
  {
    id: '2',
    name: 'Spotify',
    price: 980,
    currency: 'JPY',
    billingCycle: 'monthly',
    startDate: '2022-06-01',
    nextBillingDate: '2026-05-01',
    category: 'music',
    notes: 'プレミアム',
    color: '#10b981',
    isActive: true,
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    price: 6480,
    currency: 'JPY',
    billingCycle: 'monthly',
    startDate: '2024-03-10',
    nextBillingDate: '2026-05-10',
    category: 'software',
    notes: '個人プラン',
    color: '#ef4444',
    isActive: true,
  },
]

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSubscriptions(JSON.parse(stored))
      } else {
        setSubscriptions(SAMPLE_DATA)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA))
      }
    } catch {
      setSubscriptions(SAMPLE_DATA)
    }
    setIsLoaded(true)
  }, [])

  const save = useCallback((subs: Subscription[]) => {
    setSubscriptions(subs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
  }, [])

  const addSubscription = useCallback(
    (sub: Omit<Subscription, 'id' | 'nextBillingDate'>) => {
      const newSub: Subscription = {
        ...sub,
        id: Date.now().toString(),
        nextBillingDate: calculateNextBillingDate(sub.startDate, sub.billingCycle),
      }
      save([...subscriptions, newSub])
    },
    [subscriptions, save]
  )

  const updateSubscription = useCallback(
    (id: string, updates: Partial<Subscription>) => {
      const updated = subscriptions.map((s) => {
        if (s.id !== id) return s
        const merged = { ...s, ...updates }
        return {
          ...merged,
          nextBillingDate: calculateNextBillingDate(merged.startDate, merged.billingCycle),
        }
      })
      save(updated)
    },
    [subscriptions, save]
  )

  const deleteSubscription = useCallback(
    (id: string) => {
      save(subscriptions.filter((s) => s.id !== id))
    },
    [subscriptions, save]
  )

  return {
    subscriptions,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  }
}
