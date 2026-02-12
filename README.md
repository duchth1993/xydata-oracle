# XyData Oracle - Decentralized Data Marketplace

[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=000)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.29-blue?style=for-the-badge)](https://www.anchor-lang.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)

A complete decentralized oracle system for Solana that provides verified, real-time data feeds with cryptographic proof verification and secure payment settlement. Built with Anchor smart contracts, Python testing, and a modern Next.js dashboard.

## 🎯 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd xydata-oracle

# Install dependencies
pnpm install
pip install -r python-scripts/requirements.txt
```

### 2. Run Locally

```bash
# Terminal 1: Start Solana validator
solana-test-validator

# Terminal 2: Start web dashboard
pnpm dev

# Terminal 3: Run Python tests
python3 python-scripts/test_oracle.py
```

### 3. Deploy

```bash
# Build smart contract
cd solana-program && anchor build

# Deploy to localnet
anchor deploy

# Deploy web dashboard to Vercel
vercel deploy
```

## 📋 Features

### Core Oracle Functionality

- **Real-Time Data Feeds** - Access verified price feeds from Coingecko
- **Proof Verification** - SHA256 hash-based cryptographic proof system
- **Secure Payments** - 80/20 fee split (buyback/treasury) settlement
- **Decentralized** - Built on Solana with Anchor framework
- **No Intermediaries** - Direct on-chain verification and settlement

### Web Dashboard

- **Dashboard** - Real-time oracle metrics and data feeds
- **Data Feeds** - Browse and track active oracle feeds
- **Request Management** - Submit and monitor data requests
- **Analytics** - Fee distribution and performance metrics
- **Settings** - Admin controls and configuration

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Smart Contract | Rust + Anchor | 0.29 |
| Python Tests | Solana-py | 0.28 |
| Web Dashboard | Next.js + TypeScript | 16 |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| Blockchain | Solana | 1.17+ |

## 📁 Project Structure

```
xy-data-oracle/
├── solana-program/                # Smart contract (Rust/Anchor)
│   ├── src/
│   │   └── lib.rs                # Main oracle contract
│   ├── Anchor.toml               # Anchor configuration
│   ├── Cargo.toml                # Rust dependencies
│   └── README.md                 # Contract documentation
│
├── python-scripts/                # Python testing & utilities
│   ├── test_oracle.py            # Complete workflow test
│   ├── requirements.txt           # Python dependencies
│   ├── deploy.sh                 # Deployment helper
│   └── README.md                 # Testing documentation
│
├── app/                           # Next.js application
│   ├── page.tsx                  # Home page
│   ├── dashboard/                # Dashboard page
│   ├── requests/                 # Requests page
│   ├── feeds/                    # Feeds page
│   ├── analytics/                # Analytics page
│   ├── settings/                 # Settings page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                    # React components
│   ├── oracle/                   # Oracle-specific components
│   │   ├── OracleDashboard.tsx
│   │   ├── DataFeedCard.tsx
│   │   ├── RequestForm.tsx
│   │   ├── VerificationProof.tsx
│   │   ├── TransactionLog.tsx
│   │   └── AnalyticsPanel.tsx
│   └── ui/                       # shadcn/ui components
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md           # System design
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── API_REFERENCE.md          # API documentation
│   └── data-flow-diagram.md      # Visual diagrams
│
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Rust 1.70+** - https://www.rust-lang.org/tools/install
- **Solana CLI 1.17+** - https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor 0.29+** - https://www.anchor-lang.com/docs/installation
- **Node.js 18+** - https://nodejs.org
- **Python 3.8+** - https://www.python.org
- **pnpm** - `npm install -g pnpm`

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/duchth1993/xydata-oracle.git
   cd xydata-oracle
   ```

2. **Install all dependencies**
   ```bash
   pnpm install
   pip install -r python-scripts/requirements.txt
   ```

3. **Verify installations**
   ```bash
   solana --version
   anchor --version
   rustc --version
   node --version
   python3 --version
   ```

### Local Development

1. **Start Solana validator**
   ```bash
   solana-test-validator
   ```

2. **In another terminal, build and deploy**
   ```bash
   cd solana-program
   anchor build
   anchor deploy
   ```

3. **Start web dashboard**
   ```bash
   pnpm dev
   # Dashboard available at http://localhost:3000
   ```

4. **Run Python tests**
   ```bash
   python3 python-scripts/test_oracle.py
   ```

## 📖 Documentation

### Main Documentation Files

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design, component interactions, data models
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Step-by-step deployment guide for all environments
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - Complete smart contract API documentation

### Quick References

#### Smart Contract Instructions

- `init_oracle` - Initialize oracle with admin and fee config
- `request_data` - Submit data request
- `fetch_and_verify` - Verify data with proof
- `settle_payment` - Settle payment with fee split
- `update_oracle_config` - Update oracle settings (admin only)

#### Web Pages

- `/` - Landing page with features and stats
- `/dashboard` - Real-time oracle dashboard
- `/feeds` - Browse available data feeds
- `/requests` - Request management and history
- `/analytics` - Performance metrics and analytics
- `/settings` - Admin configuration

## 🔄 Data Flow

### Complete Request Lifecycle

```
1. Agent submits request_data("SOL/USD", 100)
   ↓ Creates RequestAccount (Pending)
   
2. Oracle fetches data from Coingecko
   ↓
   
3. Oracle calls fetch_and_verify with SHA256 proof
   ↓ Verifies proof matches computed hash
   ↓ Creates ProofAccount (Verified)
   
4. Payer calls settle_payment(1000000)
   ↓ Splits: 80% buyback, 20% treasury
   ↓ Updates RequestAccount (Settled)
   
5. Dashboard displays:
   - Real-time data
   - Verified proofs
   - Transaction history
   - Fee distribution
```

## 💰 Fee Structure

**Default Fee: 500 basis points (5%)**

### Payment Distribution

For every 1 SOL payment:
- **80% (0.8 SOL)** → Buyback pool (XYBER token repurchase)
- **20% (0.2 SOL)** → Treasury (protocol operations)

Fees are configurable by admin via `update_oracle_config`.

## 🔐 Security

### Proof Verification

Uses SHA256 hash verification to ensure data integrity:

```
proof_hash = SHA256(data_value || data_type || timestamp)
verified = (proof_hash == received_proof_hash)
```

### Account Validation

- All instructions verify correct PDA derivation
- Signer validation for admin-only operations
- Status checks prevent invalid state transitions

### Fee Limits

- Fee rates capped at 10,000 basis points (100%)
- Prevents excessive fee extraction

## 🌐 Deployment

### Local (Development)

```bash
solana-test-validator
cd solana-program && anchor build && anchor deploy
pnpm dev
```

### Devnet (Testing)

```bash
solana config set --url https://api.devnet.solana.com
solana airdrop 5
cd solana-program && anchor deploy
```

### Mainnet (Production)

```bash
solana config set --url https://api.mainnet-beta.solana.com
cd solana-program && anchor deploy
vercel deploy  # Deploy web dashboard
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Python Test Suite

```bash
cd python-scripts
python3 test_oracle.py
```

**Tests the complete workflow:**
1. Initialize oracle
2. Submit data request
3. Fetch and verify data with proof
4. Settle payment with fee distribution
5. Display transaction logs and statistics

### Interactive Deployment Script

```bash
cd python-scripts
bash deploy.sh
```

**Menu options:**
- Check requirements
- Install dependencies
- Run tests
- Build smart contract
- Deploy to localnet
- Full setup

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│               Web Dashboard (Next.js)                        │
│  Dashboard | Feeds | Requests | Analytics | Settings        │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         v             v             v
    ┌─────────────────────────────────────────┐
    │    Smart Contract (Anchor/Rust)         │
    │                                         │
    │  init_oracle                            │
    │  request_data                           │
    │  fetch_and_verify                       │
    │  settle_payment                         │
    │  update_oracle_config                   │
    └─────────────────────────────────────────┘
         │             │             │
         v             v             v
    ┌─────────────────────────────────────────┐
    │  Solana Blockchain                      │
    │  - Transaction Settlement               │
    │  - Fee Distribution                     │
    │  - Data Verification                    │
    └─────────────────────────────────────────┘
```

## 🛠️ Development

### Build Smart Contract

```bash
cd solana-program
anchor build
```

### Build Web Dashboard

```bash
pnpm build
pnpm start
```

### Code Quality

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## 📝 Environment Variables

### Development (.env.local)

```
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
NEXT_PUBLIC_PROGRAM_ID=<your-program-id>
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production

Set in Vercel/deployment dashboard:
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<mainnet-program-id>
NEXT_PUBLIC_ENVIRONMENT=production
```

## 🐛 Troubleshooting

### Smart Contract Build Issues

```bash
# Update Rust
rustup update

# Clear build cache
cargo clean
anchor clean
anchor build
```

### Python Tests Fail

```bash
# Reinstall dependencies
pip install -r python-scripts/requirements.txt --upgrade

# Verify Solana connection
solana cluster-info
```

### Web Dashboard Won't Load

```bash
# Clear build cache
rm -rf .next
pnpm install
pnpm dev
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#troubleshooting) for more solutions.

## 📚 Learning Resources

- **Anchor Framework** - https://www.anchor-lang.com
- **Solana Docs** - https://docs.solana.com
- **Next.js Docs** - https://nextjs.org/docs
- **Solana-py** - https://github.com/michaelhly/solana-py
- **Tailwind CSS** - https://tailwindcss.com

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Repository** - https://github.com/duchth1993/xydata-oracle
- **Deployed Dashboard** - https://xydata-oracle.vercel.app/
- **Solana Explorer** - https://explorer.solana.com
- **Devnet Faucet** - https://solfaucet.com

## ✨ Features

✓ Complete smart contract implementation
✓ Python testing suite with mock validator
✓ Modern Next.js dashboard with real-time data
✓ Cryptographic proof verification
✓ Secure payment settlement with fee distribution
✓ Admin configuration and settings
✓ Analytics and performance tracking
✓ Comprehensive documentation
✓ Local, devnet, and mainnet deployment support
✓ Red and black theme design
✓ Responsive mobile-friendly UI
✓ Type-safe TypeScript implementation

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API reference in [API_REFERENCE.md](docs/API_REFERENCE.md)
- See deployment guide in [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

**Built with ❤️ for the XYBER
