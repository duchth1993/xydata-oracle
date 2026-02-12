'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'

export default function SettingsPage() {
  const [feeBps, setFeeBps] = useState(500)
  const [adminAddress, setAdminAddress] = useState('admin_key_xyz...')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const feePercentage = (feeBps / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-6 md:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage oracle configuration and admin controls</p>
        </div>

        {/* Fee Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Fee Configuration</CardTitle>
            <CardDescription className="text-muted-foreground">
              Oracle fee settings and distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fee" className="text-foreground">Fee (Basis Points)</Label>
              <div className="flex gap-2">
                <Input
                  id="fee"
                  type="number"
                  value={feeBps}
                  onChange={(e) => setFeeBps(Number(e.target.value))}
                  min="0"
                  max="10000"
                  className="bg-secondary text-foreground border-border flex-1"
                />
                <div className="bg-secondary px-4 py-2 rounded border border-border flex items-center">
                  <p className="text-foreground font-medium">{feePercentage}%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter fee in basis points (100 bps = 1%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Buyback Pool</p>
                <p className="text-lg font-bold text-accent">80%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((feeBps * 80) / 10000).toFixed(2)} bps
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treasury</p>
                <p className="text-lg font-bold text-accent">20%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((feeBps * 20) / 10000).toFixed(2)} bps
                </p>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-accent hover:bg-opacity-90 text-accent-foreground font-medium"
            >
              {saved ? 'Settings Saved' : 'Save Fee Configuration'}
            </Button>
          </CardContent>
        </Card>

        {/* Admin Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Admin Controls</CardTitle>
            <CardDescription className="text-muted-foreground">
              Oracle administration and authority
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin" className="text-foreground">Admin Address</Label>
              <Input
                id="admin"
                value={adminAddress}
                readOnly
                className="bg-secondary text-foreground border-border font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The address with administrative privileges
              </p>
            </div>

            <div className="p-4 bg-secondary rounded border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="font-medium text-foreground">Admin Permissions</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Update fee configuration</li>
                <li>✓ Approve data requests</li>
                <li>✓ Verify data feeds</li>
                <li>✓ Settle payments</li>
                <li>✓ View analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Node Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Node Configuration</CardTitle>
            <CardDescription className="text-muted-foreground">
              Oracle node and network settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Network</p>
                <p className="text-foreground font-medium">Solana Mainnet</p>
                <Badge className="mt-2 bg-accent text-accent-foreground">Production</Badge>
              </div>

              <div className="p-4 bg-secondary rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Data Source</p>
                <p className="text-foreground font-medium">Coingecko API</p>
                <Badge className="mt-2 bg-accent text-accent-foreground">Active</Badge>
              </div>

              <div className="p-4 bg-secondary rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Update Frequency</p>
                <p className="text-foreground font-medium">60 seconds</p>
                <p className="text-xs text-muted-foreground mt-1">Data feeds refresh</p>
              </div>

              <div className="p-4 bg-secondary rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Proof Verification</p>
                <p className="text-foreground font-medium">SHA256 Hash</p>
                <p className="text-xs text-muted-foreground mt-1">Cryptographic method</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Data */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Security & Data</CardTitle>
            <CardDescription className="text-muted-foreground">
              Data management and security options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded border border-border">
              <p className="font-medium text-foreground mb-2">Data Retention</p>
              <p className="text-sm text-muted-foreground">Transaction logs stored for 90 days</p>
            </div>

            <div className="p-4 bg-secondary rounded border border-border">
              <p className="font-medium text-foreground mb-2">Encryption</p>
              <p className="text-sm text-muted-foreground">All sensitive data encrypted with AES-256</p>
            </div>

            <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
              Export Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
      </main>
    </div>
  )
}
