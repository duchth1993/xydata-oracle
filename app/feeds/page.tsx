'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DataFeedCard from '@/components/oracle/DataFeedCard'
import { Header } from '@/components/layout/Header'

interface DataFeed {
  id: string
  name: string
  type: string
  value: number
  verified: boolean
  lastUpdate: string
  feedUrl: string
}

const mockFeeds: DataFeed[] = [
  {
    id: '1',
    name: 'SOL/USD',
    type: 'Price Feed',
    value: 195.50,
    verified: true,
    lastUpdate: new Date().toISOString(),
    feedUrl: 'coingecko/sol-usd',
  },
  {
    id: '2',
    name: 'BTC/USD',
    type: 'Price Feed',
    value: 98250.75,
    verified: true,
    lastUpdate: new Date(Date.now() - 60000).toISOString(),
    feedUrl: 'coingecko/btc-usd',
  },
  {
    id: '3',
    name: 'ETH/USD',
    type: 'Price Feed',
    value: 3420.25,
    verified: true,
    lastUpdate: new Date(Date.now() - 120000).toISOString(),
    feedUrl: 'coingecko/eth-usd',
  },
  {
    id: '4',
    name: 'XRP/USD',
    type: 'Price Feed',
    value: 2.85,
    verified: true,
    lastUpdate: new Date(Date.now() - 180000).toISOString(),
    feedUrl: 'coingecko/xrp-usd',
  },
]

export default function FeedsPage() {
  const verifiedCount = mockFeeds.filter(f => f.verified).length
  const averagePrice = (
    mockFeeds.reduce((sum, f) => sum + f.value, 0) / mockFeeds.length
  ).toFixed(2)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Feeds</h1>
          <p className="text-muted-foreground mt-2">Browse available oracle data feeds</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Feeds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{mockFeeds.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Available data feeds</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{verifiedCount}</div>
              <p className="text-xs text-muted-foreground mt-2">Verification status</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">${averagePrice}</div>
              <p className="text-xs text-muted-foreground mt-2">Average feed value</p>
            </CardContent>
          </Card>
        </div>

        {/* Feeds List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Active Feeds</h2>
            <Badge className="bg-accent text-accent-foreground">{mockFeeds.length} feeds</Badge>
          </div>
          
          {mockFeeds.map((feed) => (
            <DataFeedCard key={feed.id} feed={feed} />
          ))}
        </div>
      </div>
      </main>
    </div>
  )
}
