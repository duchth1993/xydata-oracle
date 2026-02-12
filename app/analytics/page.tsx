'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'

interface AnalyticsMetric {
  label: string
  value: string | number
  change?: number
  unit?: string
}

export default function AnalyticsPage() {
  const metrics: AnalyticsMetric[] = [
    {
      label: 'Total Requests',
      value: 1234,
      change: 12,
      unit: 'requests',
    },
    {
      label: 'Verified Feeds',
      value: 892,
      change: 8,
      unit: 'feeds',
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      change: 2.1,
      unit: 'percent',
    },
    {
      label: 'Avg Response Time',
      value: '245ms',
      change: -15,
      unit: 'ms',
    },
  ]

  const feeDistribution = [
    { label: 'Buyback Pool', percentage: 80, amount: '800,000 XYBER' },
    { label: 'Treasury', percentage: 20, amount: '200,000 XYBER' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Oracle performance metrics and fee distribution</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-accent">{metric.value}</div>
                  {metric.change !== undefined && (
                    <p className={`text-xs font-medium ${
                      metric.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}% from last period
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fee Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Fee Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">
              How collected fees are allocated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feeDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <Badge className="bg-accent text-accent-foreground">
                      {item.percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <div 
                      className="bg-accent h-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Daily Volume</CardTitle>
              <CardDescription className="text-muted-foreground">Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const height = 30 + Math.random() * 40
                  return (
                    <div key={day} className="flex items-end gap-2">
                      <p className="text-sm text-muted-foreground w-8">{day}</p>
                      <div 
                        className="bg-accent rounded flex-1"
                        style={{ height: `${height}px`, minHeight: '4px' }}
                      ></div>
                      <p className="text-sm text-foreground w-12 text-right">
                        {Math.floor(Math.random() * 200) + 50}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Verification Status</CardTitle>
              <CardDescription className="text-muted-foreground">Feed reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-foreground">Successful Verifications</p>
                    <p className="text-sm font-bold text-accent">98.5%</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <div className="bg-accent h-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-foreground">On-Time Delivery</p>
                    <p className="text-sm font-bold text-accent">99.2%</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <div className="bg-accent h-full" style={{ width: '99.2%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-foreground">System Uptime</p>
                    <p className="text-sm font-bold text-accent">99.9%</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                    <div className="bg-accent h-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
    </div>
  )
}
