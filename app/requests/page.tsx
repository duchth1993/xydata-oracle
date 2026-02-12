'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RequestForm from '@/components/oracle/RequestForm'
import { Header } from '@/components/layout/Header'

interface Request {
  id: string
  dataType: string
  quantity: number
  status: 'pending' | 'verified' | 'settled'
  createdAt: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 'req-001',
      dataType: 'SOL/USD',
      quantity: 100,
      status: 'settled',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ])

  const handleSubmit = (data: { dataType: string; quantity: number }) => {
    const newRequest: Request = {
      id: `req-${String(requests.length + 1).padStart(3, '0')}`,
      dataType: data.dataType,
      quantity: data.quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests([newRequest, ...requests])
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-200'
      case 'verified': return 'bg-accent text-accent-foreground'
      case 'settled': return 'bg-green-900 text-green-200'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Requests</h1>
          <p className="text-muted-foreground mt-2">Manage and track your oracle data requests</p>
        </div>

        {/* Request Form */}
        <RequestForm onSubmit={handleSubmit} />

        {/* Request History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Request History</CardTitle>
            <CardDescription className="text-muted-foreground">
              {requests.length} total requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No requests yet. Create one above!</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div 
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-secondary rounded border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{req.dataType}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(req.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{req.quantity}</p>
                        <p className="text-xs text-muted-foreground">data points</p>
                      </div>
                      <Badge className={getStatusBadgeColor(req.status)}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
    </div>
  )
}
