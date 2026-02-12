'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DataFeedCardProps {
  feed: {
    id: string
    name: string
    type: string
    value: number
    verified: boolean
    lastUpdate: string
    feedUrl: string
  }
}

export default function DataFeedCard({ feed }: DataFeedCardProps) {
  const lastUpdateTime = new Date(feed.lastUpdate)
  const timeAgo = Math.floor((Date.now() - lastUpdateTime.getTime()) / 1000)
  
  let timeLabel = ''
  if (timeAgo < 60) {
    timeLabel = 'just now'
  } else if (timeAgo < 3600) {
    timeLabel = `${Math.floor(timeAgo / 60)}m ago`
  } else {
    timeLabel = `${Math.floor(timeAgo / 3600)}h ago`
  }

  return (
    <Card className="bg-card border-border hover:bg-opacity-80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">{feed.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{feed.type}</CardDescription>
          </div>
          <Badge 
            variant={feed.verified ? 'default' : 'secondary'}
            className={feed.verified ? 'bg-accent text-accent-foreground' : ''}
          >
            {feed.verified ? 'Verified' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
            <p className="text-2xl font-bold text-accent">
              ${feed.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm text-foreground font-medium">{timeLabel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-sm text-foreground font-medium font-mono">{feed.feedUrl}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
