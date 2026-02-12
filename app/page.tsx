'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'

export default function Page() {
  const features = [
    {
      title: 'Real-Time Data Feeds',
      description: 'Access verified price feeds and data from multiple sources with cryptographic proof verification',
      icon: '📊',
    },
    {
      title: 'Proof Verification',
      description: 'SHA256 hash-based proof system ensures data integrity and authenticity on-chain',
      icon: '✓',
    },
    {
      title: 'Secure Payments',
      description: '80/20 fee split mechanism with automatic buyback and treasury distribution',
      icon: '💰',
    },
    {
      title: 'Decentralized Oracle',
      description: 'Powered by Solana and Anchor framework for secure, fast data settlement',
      icon: '⚙️',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          Decentralized Data Marketplace
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          XyData Oracle provides verified, real-time data feeds with cryptographic proof verification and secure payments on Solana.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-accent hover:bg-opacity-90 text-accent-foreground font-medium px-8">
              Launch Dashboard
            </Button>
          </Link>
          <Link href="/feeds">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-8">
              Browse Feeds
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">1234</CardTitle>
              <CardDescription className="text-muted-foreground">Total Requests</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">98.5%</CardTitle>
              <CardDescription className="text-muted-foreground">Success Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">4</CardTitle>
              <CardDescription className="text-muted-foreground">Active Feeds</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">1.5M</CardTitle>
              <CardDescription className="text-muted-foreground">SOL Fees</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Smart Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Built with Anchor framework</p>
              <p>• SHA256 proof verification</p>
              <p>• PDA account management</p>
              <p>• Fee distribution logic</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Python Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Solana-py integration</p>
              <p>• Coingecko API simulation</p>
              <p>• Complete workflow testing</p>
              <p>• Mock validator support</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Web Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Next.js 16 frontend</p>
              <p>• Real-time data display</p>
              <p>• Request management</p>
              <p>• Analytics dashboard</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-border">
        <h2 className="text-4xl font-bold text-foreground mb-6">Ready to get started?</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Explore the XyData Oracle dashboard and start using verified data feeds today.
        </p>
        <Link href="/dashboard">
          <Button className="bg-accent hover:bg-opacity-90 text-accent-foreground font-medium px-8 text-lg py-6">
            Go to Dashboard
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 XyData Oracle. Decentralized data marketplace on Solana.</p>
        </div>
      </footer>
      </main>
    </div>
  )
}
