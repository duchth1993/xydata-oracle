'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RequestFormProps {
  onSubmit?: (data: { dataType: string; quantity: number }) => void
}

export default function RequestForm({ onSubmit }: RequestFormProps) {
  const [dataType, setDataType] = useState('SOL/USD')
  const [quantity, setQuantity] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSubmit) {
      onSubmit({ dataType, quantity })
    }

    setSubmitted(true)
    setTimeout(() => {
      setDataType('SOL/USD')
      setQuantity(1)
      setSubmitted(false)
    }, 2000)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Request Data</CardTitle>
        <CardDescription className="text-muted-foreground">
          Submit a new data request to the oracle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataType" className="text-foreground">Data Type</Label>
            <Input
              id="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              placeholder="e.g., SOL/USD"
              className="bg-secondary text-foreground border-border"
              disabled={submitted}
            />
            <p className="text-xs text-muted-foreground">
              Specify the data feed (e.g., SOL/USD, BTC/USD, ETH/USD)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max="1000"
              className="bg-secondary text-foreground border-border"
              disabled={submitted}
            />
            <p className="text-xs text-muted-foreground">
              Number of data points requested
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={submitted}
            className="w-full bg-accent hover:bg-opacity-90 text-accent-foreground font-medium"
          >
            {submitted ? 'Request Submitted' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
