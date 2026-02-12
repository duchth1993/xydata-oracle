'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataFeedCard from './DataFeedCard'
import VerificationProof from './VerificationProof'
import TransactionLog from './TransactionLog'

interface DataFeed {
  id: string
  name: string
  type: string
  value: number
  verified: boolean
  lastUpdate: string
  feedUrl: string
}

interface Transaction {
  id: string
  type: 'request' | 'verify' | 'settle'
  status: 'pending' | 'verified' | 'settled'
  amount?: number
  timestamp: string
}

export default function OracleDashboard() {
  const [dataFeeds, setDataFeeds] = useState<DataFeed[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalFees, setTotalFees] = useState(0)
  const [requestCount, setRequestCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setDataFeeds([
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
      ])

      setTransactions([
        {
          id: 'tx-001',
          type: 'request',
          status: 'settled',
          amount: 1000000,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'tx-002',
          type: 'verify',
          status: 'verified',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'tx-003',
          type: 'settle',
          status: 'settled',
          amount: 500000,
          timestamp: new Date().toISOString(),
        },
      ])

      setTotalFees(1500000)
      setRequestCount(3)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground animate-pulse">Loading oracle data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Oracle Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time data feeds and verification status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{requestCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Data requests processed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fees Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{(totalFees / 1000000).toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground mt-2">{totalFees} lamports</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{dataFeeds.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Verified data feeds</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="feeds">Data Feeds</TabsTrigger>
          <TabsTrigger value="proofs">Verification Proofs</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Data Feeds Tab */}
        <TabsContent value="feeds" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {dataFeeds.map((feed) => (
              <DataFeedCard key={feed.id} feed={feed} />
            ))}
          </div>
        </TabsContent>

        {/* Verification Proofs Tab */}
        <TabsContent value="proofs" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {dataFeeds.filter(f => f.verified).map((feed) => (
              <VerificationProof key={feed.id} feed={feed} />
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <TransactionLog transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
