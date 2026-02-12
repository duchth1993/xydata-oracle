'use client'

import OracleDashboard from '@/components/oracle/OracleDashboard'
import { Header } from '@/components/layout/Header'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <OracleDashboard />
      </main>
    </div>
  )
}
