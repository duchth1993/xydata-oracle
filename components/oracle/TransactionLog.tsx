'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: string
  type: 'request' | 'verify' | 'settle'
  status: 'pending' | 'verified' | 'settled'
  amount?: number
  timestamp: string
}

interface TransactionLogProps {
  transactions: Transaction[]
}

export default function TransactionLog({ transactions }: TransactionLogProps) {
  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'request': return 'Data Request'
      case 'verify': return 'Verification'
      case 'settle': return 'Settlement'
      default: return type
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-200'
      case 'verified': return 'bg-accent text-accent-foreground'
      case 'settled': return 'bg-green-900 text-green-200'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Transaction History</CardTitle>
        <CardDescription className="text-muted-foreground">
          {transactions.length} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 bg-secondary rounded border border-border hover:bg-opacity-80 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="font-medium text-foreground">{getTransactionLabel(tx.type)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(tx.timestamp)} at {formatTime(tx.timestamp)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {tx.amount && (
                    <div className="text-right">
                      <p className="font-mono text-foreground">{(tx.amount / 1000000).toFixed(2)} SOL</p>
                      <p className="text-xs text-muted-foreground">{tx.amount} lamports</p>
                    </div>
                  )}
                  <Badge className={getStatusBadgeColor(tx.status)}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
