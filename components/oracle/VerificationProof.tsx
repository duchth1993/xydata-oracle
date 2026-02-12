'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VerificationProofProps {
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

export default function VerificationProof({ feed }: VerificationProofProps) {
  // Simulate proof hash (would come from blockchain)
  const proofHash = `sha256_${feed.id}_${Math.random().toString(16).substr(2, 16)}...`
  
  // Simulate proof verification time
  const verificationTime = new Date(feed.lastUpdate).toLocaleTimeString()

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">{feed.name} Proof</CardTitle>
            <CardDescription className="text-muted-foreground">Verification Details</CardDescription>
          </div>
          <Badge className="bg-accent text-accent-foreground">Verified</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-secondary rounded border border-border">
            <p className="text-xs text-muted-foreground mb-2">Data Value</p>
            <p className="text-foreground font-mono break-all text-sm">
              {(feed.value * 100).toString()} cents
            </p>
          </div>
          
          <div className="p-3 bg-secondary rounded border border-border">
            <p className="text-xs text-muted-foreground mb-2">Verification Time</p>
            <p className="text-foreground font-mono text-sm">{verificationTime}</p>
          </div>
        </div>

        <div className="p-3 bg-secondary rounded border border-border">
          <p className="text-xs text-muted-foreground mb-2">SHA256 Proof Hash</p>
          <p className="text-foreground font-mono break-all text-xs">{proofHash}</p>
        </div>

        <div className="p-3 bg-secondary rounded border border-border">
          <p className="text-xs text-muted-foreground mb-2">Verification Status</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <p className="text-foreground text-sm font-medium">Verified on-chain</p>
          </div>
        </div>

        <div className="p-3 bg-secondary rounded border border-border">
          <p className="text-xs text-muted-foreground mb-2">Feed Source</p>
          <p className="text-foreground text-sm">{feed.feedUrl}</p>
        </div>
      </CardContent>
    </Card>
  )
}
