# XyData Oracle - Complete Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Testing the Oracle](#testing-the-oracle)
4. [Deploying to Solana](#deploying-to-solana)
5. [Web Dashboard Deployment](#web-dashboard-deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

```bash
# Rust & Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
export PATH="/home/user/.local/share/solana/install/active_release/bin:$PATH"

# Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 avm
avm install 0.29.0
avm use 0.29.0

# Node.js & npm/pnpm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
npm install -g pnpm

# Python 3.8+
python3 --version
pip3 install -r python-scripts/requirements.txt
```

### System Requirements

- **RAM:** 16GB+ recommended
- **Storage:** 50GB+ for validator and dependencies
- **OS:** Linux (Ubuntu 20.04+), macOS, or Windows WSL2
- **Internet:** Stable connection for RPC calls

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd xy-data-oracle

# Install all dependencies
pnpm install
pip install -r python-scripts/requirements.txt

# Verify installations
solana --version
anchor --version
rustc --version
python3 --version
```

### Step 2: Start Local Validator

```bash
# Terminal 1: Start Solana validator
solana-test-validator

# This creates a local blockchain at localhost:8899
# Default system program and token program are deployed

# In another terminal, verify connection:
solana cluster-info
```

### Step 3: Configure Anchor

```bash
# Create local keypair (if not exists)
solana-keygen new --outfile ~/.config/solana/id.json

# Set localhost as default cluster
solana config set --url http://localhost:8899

# Check configuration
solana config get
```

### Step 4: Build Smart Contract

```bash
cd solana-program

# Build the Anchor program
anchor build

# Output should show:
# Compiling xy_data_oracle v0.1.0
# Finished release [optimized] target(s) in X.XXs
```

### Step 5: Deploy Smart Contract

```bash
# Deploy to local validator
anchor deploy

# Output will show:
# Program Id: <Program_ID>
# Transaction signature: <TX_ID>

# Save the Program ID for testing
export PROGRAM_ID=$(anchor keys list | grep xy_data_oracle | awk '{print $NF}')
echo $PROGRAM_ID
```

## Testing the Oracle

### Run Python Test Suite

```bash
cd python-scripts

# Install dependencies
pip install -r requirements.txt

# Run complete workflow test
python3 test_oracle.py

# Expected output:
# ======================================================================
# XyData Oracle - Complete Workflow Demonstration
# ======================================================================
#
# [STEP 1] Initialize Oracle
# ✓ Oracle initialized...
# [STEP 2] Agent Requests Data
# 📊 Data request created...
# [STEP 3] Fetch and Verify Data
# 🌐 Fetching data from Coingecko...
# ✓ Data verified with proof...
# [STEP 4] Settle Payment
# 💰 Payment settled...
# [SUMMARY]
# ✓ Workflow completed successfully!
```

### Interactive Deployment Script

```bash
cd python-scripts

# Run interactive menu
bash deploy.sh

# Options:
# 1) Check requirements
# 2) Install dependencies
# 3) Run tests
# 4) Build smart contract
# 5) Deploy contract
# 6) Full setup
# 7) Exit
```

## Deploying to Solana

### Deploy to Devnet

```bash
# Configure for devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL (need devnet faucet)
solana airdrop 5

# Deploy
cd solana-program
anchor deploy

# Verify deployment
solana account <PROGRAM_ID>
```

### Deploy to Mainnet

#### 1. Prepare for Mainnet

```bash
# Create mainnet keypair (with real SOL)
solana-keygen new --outfile ~/.config/solana/mainnet.json

# Fund with SOL (minimum ~2 SOL for deployment)
# Use your exchange or wallet to send SOL

# Configure Anchor for mainnet
cat >> Anchor.toml <<EOF
[programs.mainnet]
xy_data_oracle = "YOUR_PROGRAM_ID_HERE"
EOF

# Set mainnet as cluster
solana config set --url https://api.mainnet-beta.solana.com
```

#### 2. Deploy to Mainnet

```bash
# Build for production
anchor build --verifiable

# Deploy (this costs ~1-2 SOL in fees)
anchor deploy --provider.cluster mainnet

# Save output Program ID
# Verify: solana account <PROGRAM_ID>
```

#### 3. Upgrade Program (if needed)

```bash
# To upgrade an existing program
anchor deploy --provider.cluster mainnet
```

## Web Dashboard Deployment

### Deploy to Vercel (Recommended)

#### 1. Prepare GitHub Repository

```bash
# Initialize git repo (if not already)
git init
git add .
git commit -m "Initial XyData Oracle commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_GITHUB/xy-data-oracle.git
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Follow prompts:
# - Link to GitHub repo
# - Select framework: Next.js
# - Confirm settings
# - Get deployment URL
```

**Option B: GitHub Integration**

1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Select `xy-data-oracle`
5. Configure:
   - Root directory: `/` (default)
   - Build command: `pnpm build` (auto-detected)
   - Output directory: `.next` (auto-detected)
6. Click "Deploy"

#### 3. Environment Variables

Create `.env.local` for development:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID
NEXT_PUBLIC_ENVIRONMENT=mainnet
```

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the same variables
3. Redeploy to apply

### Deploy to Self-Hosted Server

```bash
# Build the application
pnpm build

# Output in `.next/` directory

# Deploy options:
# 1. Docker
# 2. PM2
# 3. Systemd service

# Example with PM2:
npm install -g pm2

pm2 start npm --name "oracle-dashboard" -- start
pm2 save
pm2 startup
```

## Complete Deployment Flow

### Diagram: Development to Production

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                  │
│                    ✓ Local Validator                        │
│                    ✓ Python Tests                           │
│                    ✓ Web Dashboard (localhost:3000)         │
└────────────────────────────┬────────────────────────────────┘
                             │
                    Run Tests, Verify
                             │
┌────────────────────────────v────────────────────────────────┐
│                    DEVNET ENVIRONMENT                        │
│                    ✓ Devnet Validator                       │
│                    ✓ Real RPC Endpoint                      │
│                    ✓ Deploy Contract                        │
│                    ✓ Test with Real Network                 │
└────────────────────────────┬────────────────────────────────┘
                             │
              Final Testing & Security Audit
                             │
┌────────────────────────────v────────────────────────────────┐
│                  PRODUCTION ENVIRONMENT                      │
│                    ✓ Mainnet RPC                            │
│                    ✓ Deployed Program                       │
│                    ✓ Vercel Dashboard                       │
│                    ✓ Live Oracle Service                    │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Deployment Checklist

**Phase 1: Local Development**
- [ ] Install all prerequisites
- [ ] Start local validator
- [ ] Build smart contract
- [ ] Deploy to localnet
- [ ] Run Python tests successfully
- [ ] Test web dashboard locally

**Phase 2: Devnet Testing**
- [ ] Airdrop SOL to devnet wallet
- [ ] Deploy contract to devnet
- [ ] Run integration tests
- [ ] Test with real RPC endpoint
- [ ] Verify feed data accuracy

**Phase 3: Production Deployment**
- [ ] Prepare mainnet keypair
- [ ] Fund with sufficient SOL
- [ ] Perform security audit
- [ ] Deploy contract to mainnet
- [ ] Deploy web dashboard to Vercel
- [ ] Configure environment variables
- [ ] Monitor for errors and performance

## Verification Steps

### Verify Smart Contract Deployment

```bash
# Check program exists
solana account <PROGRAM_ID>

# Get program info
solana program show <PROGRAM_ID>

# View program bytecode (partial)
solana program dump <PROGRAM_ID> program.so

# Check recent transactions
solana address-lookup-table list
```

### Verify Web Dashboard

```bash
# Check deployment
curl https://YOUR_VERCEL_URL

# Should return HTML with "XyData Oracle" title

# Check API health
curl https://YOUR_VERCEL_URL/api/health

# Verify Solana connection
curl https://YOUR_VERCEL_URL/api/oracle/status
```

### Verify Integration

```bash
# Test data flow
python3 python-scripts/test_oracle.py

# Verify dashboard loads with real data
open https://YOUR_VERCEL_URL/dashboard

# Check all pages load
curl -I https://YOUR_VERCEL_URL/dashboard
curl -I https://YOUR_VERCEL_URL/feeds
curl -I https://YOUR_VERCEL_URL/requests
curl -I https://YOUR_VERCEL_URL/analytics
curl -I https://YOUR_VERCEL_URL/settings
```

## Troubleshooting

### Common Issues

**Error: "anchor: command not found"**
```bash
# Reinstall Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 avm
avm install 0.29.0
avm use 0.29.0
```

**Error: "RPC request failed"**
```bash
# Check validator is running
solana cluster-info

# Ensure RPC URL is correct
solana config get

# If needed, switch to official RPC:
solana config set --url https://api.mainnet-beta.solana.com
```

**Error: "Program account not found"**
```bash
# Verify program deployed correctly
solana address-lookup-table list

# Deploy again if needed
anchor deploy

# Get new program ID
anchor keys list
```

**Web Dashboard won't load**
```bash
# Check build succeeded
pnpm build

# Verify environment variables set
echo $NEXT_PUBLIC_PROGRAM_ID

# Check Solana connection
curl $NEXT_PUBLIC_SOLANA_RPC_URL
```

**Python tests fail**
```bash
# Verify Python installed
python3 --version

# Reinstall dependencies
pip install -r python-scripts/requirements.txt --upgrade

# Check mock validator isn't conflicting
ps aux | grep solana-test-validator
```

## Performance Monitoring

### Dashboard Metrics

Monitor in Vercel dashboard:
- Build time
- Function execution time
- Edge function latency
- Error rates

### On-Chain Metrics

Monitor oracle contract:
```bash
# Get account info
solana account <ORACLE_ACCOUNT_PUBKEY>

# Check transaction history
solana transaction-history <ORACLE_ACCOUNT_PUBKEY>

# Monitor fees collected
# (Check OracleAccount.total_fees_collected)
```

## Maintenance

### Regular Tasks

- **Weekly**: Check oracle health and uptime
- **Monthly**: Update dependencies
- **Quarterly**: Security audit and code review
- **Yearly**: Full system penetration test

### Updating Oracle

```bash
# Update smart contract
cd solana-program
# Make changes to lib.rs
anchor build
anchor deploy

# Update web dashboard
# Make changes to React components
pnpm build
git push  # Vercel auto-deploys

# Update Python tests
# Make changes to test_oracle.py
git push
```

## Support & Resources

- **Anchor Documentation:** https://www.anchor-lang.com
- **Solana Documentation:** https://docs.solana.com
- **Next.js Documentation:** https://nextjs.org/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Python Solana SDK:** https://github.com/michaelhly/solana-py

