# XyData Oracle - Quick Reference

## Setup Commands

### 1. Initial Setup
```bash
# Install dependencies
git clone <repo> && cd xy-data-oracle
pnpm install
pip install -r python-scripts/requirements.txt

# Verify installations
solana --version && anchor --version && node --version && python3 --version
```

### 2. Start Local Environment
```bash
# Terminal 1: Start validator
solana-test-validator

# Terminal 2: Configure
solana config set --url http://localhost:8899
solana config get

# Terminal 3: Build & Deploy contract
cd solana-program && anchor build && anchor deploy

# Terminal 4: Start dashboard
pnpm dev

# Terminal 5: Run tests
python3 python-scripts/test_oracle.py
```

---

## Common Commands

### Smart Contract Development

```bash
# Build contract
cd solana-program
anchor build

# Deploy to localnet
anchor deploy

# Deploy to devnet
solana config set --url https://api.devnet.solana.com
anchor deploy

# Deploy to mainnet
solana config set --url https://api.mainnet-beta.solana.com
anchor deploy

# Get program ID
anchor keys list

# View program
solana account <PROGRAM_ID>

# Clean build
anchor clean && anchor build

# View contract logs
solana logs <PROGRAM_ID>
```

### Web Dashboard

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start

# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm type-check

# Deploy to Vercel
vercel deploy
```

### Python Testing

```bash
# Run full workflow test
python3 python-scripts/test_oracle.py

# Install dependencies
pip install -r python-scripts/requirements.txt

# Interactive menu
bash python-scripts/deploy.sh

# Quick test
bash python-scripts/deploy.sh test

# Build contract from scripts
bash python-scripts/deploy.sh build
```

### Solana Network

```bash
# Check cluster
solana cluster-info

# Get balance
solana balance

# Request airdrop
solana airdrop 5

# Check account
solana account <ACCOUNT_PUBKEY>

# View transactions
solana transaction-history <ACCOUNT_PUBKEY>

# Monitor logs
solana logs

# Set default config
solana config set --url <RPC_URL>
```

---

## Deployment Checklist

### Local Development ✓
- [ ] `solana-test-validator` running
- [ ] `anchor build` completed
- [ ] `anchor deploy` successful
- [ ] `pnpm dev` accessible at localhost:3000
- [ ] `python3 test_oracle.py` passes

### Devnet Testing
- [ ] `solana config set --url https://api.devnet.solana.com`
- [ ] `solana airdrop 5` successful
- [ ] `anchor deploy` completed
- [ ] Program ID saved: `export PROGRAM_ID=...`
- [ ] Dashboard environment variables set

### Mainnet Production
- [ ] Mainnet keypair created
- [ ] 2+ SOL funded
- [ ] Contract audited
- [ ] `anchor deploy` completed
- [ ] Vercel deployment configured
- [ ] Environment variables set
- [ ] Monitoring enabled

---

## Environment Variables

### .env.local (Development)
```env
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
NEXT_PUBLIC_PROGRAM_ID=<program-id>
NEXT_PUBLIC_ENVIRONMENT=development
```

### .env.production (Mainnet)
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<mainnet-program-id>
NEXT_PUBLIC_ENVIRONMENT=production
```

### Vercel Dashboard
Set in Project Settings → Environment Variables

---

## File Quick Reference

### Documentation
| File | Purpose |
|------|---------|
| `/README.md` | Main project overview |
| `/IMPLEMENTATION_SUMMARY.md` | What was built |
| `/QUICK_REFERENCE.md` | This file |
| `/docs/ARCHITECTURE.md` | System design |
| `/docs/DEPLOYMENT.md` | Deployment guide |
| `/docs/API_REFERENCE.md` | Contract API |

### Smart Contract
| File | Purpose |
|------|---------|
| `/solana-program/src/lib.rs` | Oracle contract |
| `/solana-program/Anchor.toml` | Anchor config |
| `/solana-program/Cargo.toml` | Rust dependencies |
| `/solana-program/README.md` | Contract docs |

### Python Testing
| File | Purpose |
|------|---------|
| `/python-scripts/test_oracle.py` | Workflow test |
| `/python-scripts/deploy.sh` | Helper script |
| `/python-scripts/requirements.txt` | Python deps |
| `/python-scripts/README.md` | Testing docs |

### Web Dashboard
| File | Purpose |
|------|---------|
| `/app/page.tsx` | Home page |
| `/app/dashboard/page.tsx` | Dashboard |
| `/app/requests/page.tsx` | Requests |
| `/app/feeds/page.tsx` | Feeds |
| `/app/analytics/page.tsx` | Analytics |
| `/app/settings/page.tsx` | Settings |
| `/components/oracle/` | Oracle components |

---

## Troubleshooting Quick Fixes

### Validator Won't Start
```bash
killall solana-test-validator
solana-test-validator
```

### Build Fails
```bash
cd solana-program
anchor clean
anchor build
```

### Contract Won't Deploy
```bash
# Check connection
solana cluster-info

# Check keypair
solana address

# Re-deploy
anchor deploy
```

### Python Tests Fail
```bash
# Reinstall dependencies
pip install -r python-scripts/requirements.txt --upgrade

# Check Python version
python3 --version  # Should be 3.8+

# Run directly
cd python-scripts
python3 test_oracle.py
```

### Dashboard Won't Load
```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm dev
```

### Wrong Network
```bash
# Check current config
solana config get

# Switch to localnet
solana config set --url http://localhost:8899

# Switch to devnet
solana config set --url https://api.devnet.solana.com

# Switch to mainnet
solana config set --url https://api.mainnet-beta.solana.com
```

---

## URLs & Endpoints

### Local
- Dashboard: http://localhost:3000
- Validator RPC: http://localhost:8899

### Devnet
- Explorer: https://explorer.solana.com?cluster=devnet
- Faucet: https://solfaucet.com

### Mainnet
- Explorer: https://explorer.solana.com
- RPC: https://api.mainnet-beta.solana.com
- Dashboard: https://your-vercel-url.vercel.app

---

## Key Metrics

### Deployment Costs
| Network | Cost |
|---------|------|
| Local | Free |
| Devnet | Free (airdrop) |
| Mainnet | ~2 SOL (~$390 @ $195/SOL) |

### Performance
| Operation | Compute Units | Time |
|-----------|----------------|------|
| init_oracle | 2,500 CU | <1s |
| request_data | 3,000 CU | <1s |
| fetch_and_verify | 3,500 CU | <1s |
| settle_payment | 2,000 CU | <1s |

### Throughput
- Local: Unlimited
- Devnet/Mainnet: Limited by Solana (400+ TPS)

---

## Useful Resources

### Official Docs
- Anchor: https://www.anchor-lang.com/docs
- Solana: https://docs.solana.com
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs

### Tools
- Solana Explorer: https://explorer.solana.com
- Anchor IDL: https://github.com/coral-xyz/anchor/blob/master/examples
- Solana Cookbook: https://solanacookbook.com

### Community
- Solana Discord: https://discord.gg/solana
- Anchor Discord: https://discord.gg/cJYcSf33DH

---

## Key Concepts

### PDA (Program Derived Address)
```
Oracle: ["oracle"]
Request: ["request", requester, oracle]
Proof: ["proof", request]
```

### Fee Distribution
```
Payment: 1,000,000 lamports
Buyback (80%): 800,000 lamports
Treasury (20%): 200,000 lamports
```

### Request Status Flow
```
Pending → Verified → Settled
```

### Proof Verification
```
hash = SHA256(value || type || timestamp)
verified = (hash == received_hash)
```

---

## Support

### Documentation
- See `/docs/` for detailed guides
- Check `/README.md` for overview
- Read `/IMPLEMENTATION_SUMMARY.md` for what was built

### Troubleshooting
- See `/docs/DEPLOYMENT.md#troubleshooting`
- Check contract logs: `solana logs <PROGRAM_ID>`
- View dashboard console: Browser DevTools → Console

### Issues
- GitHub Issues: Open an issue
- Email: Support contact
- Discord: Join community

---

## Quick Status Check

```bash
# Check Solana connection
solana cluster-info

# Check validator (if running locally)
curl http://localhost:8899

# Check program deployed
solana account <PROGRAM_ID>

# Check dashboard health
curl http://localhost:3000

# Run tests
python3 python-scripts/test_oracle.py
```

---

**Need help?** See `/docs/DEPLOYMENT.md` for detailed guidance or check `/README.md` for overview.
