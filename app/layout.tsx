import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TOEIC 英単語アプリ',
  description: 'レベル別TOEIC英単語学習アプリ。4択・タイピングで効率よく学習できます。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  )
}
