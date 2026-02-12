# XyData Oracle - System Architecture

## Overview

XyData Oracle is a complete decentralized data marketplace system built on Solana. It consists of three main components working together:

1. **Smart Contract** (Rust/Anchor) - Handles on-chain logic and state
2. **Python Testing Suite** - Demonstrates workflow and enables testing
3. **Web Dashboard** (Next.js) - User interface for the oracle system

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Agents / Requesters                         │
│                    (Web Dashboard Users)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    Request Data        Browse Feeds       Verify Proofs
         │                   │                   │
         v                   v                   v
┌─────────────────────────────────────────────────────────────────┐
│                     Web Dashboard (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Dashboard  │  │   Requests   │  │   Analytics/Feeds    │   │
│  │              │  │              │  │                      │   │
│  │ - Live feeds │  │ - Submit     │  │ - Verification proof │   │
│  │ - Fee stats  │  │   requests   │  │ - Fee distribution   │   │
│  │ - TX log     │  │ - Track      │  │ - Settings           │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────┬─────────────────────────────────┘
                              │
                    API Calls & Data Fetch
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         v                    v                    v
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Smart Contract   │  │  Oracle Logic    │  │ Data Verification│
│ (Anchor/Rust)    │  │                  │  │                  │
│                  │  │ - init_oracle    │  │ - SHA256 Proof   │
│ Accounts:        │  │ - request_data   │  │ - Hash Verify    │
│ - OracleAccount  │  │ - fetch_verify   │  │ - PDA Derivation │
│ - RequestAccount │  │ - settle_payment │  │                  │
│ - ProofAccount   │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │
         └─────────────────────────────┬──────────────────────┐
                                       │                      │
                                       v                      v
                            ┌─────────────────┐   ┌──────────────────┐
                            │ Coingecko API   │   │ Solana Blockchain│
                            │ (Price Data)    │   │                  │
                            │                 │   │ - Transaction    │
                            │ - SOL/USD       │   │   Settlement     │
                            │ - BTC/USD       │   │ - Payment Split  │
                            │ - ETH/USD       │   │ - Fee Collection │
                            └─────────────────┘   └──────────────────┘
```

## Component Details

### 1. Smart Contract (Solana/Anchor)

**Location:** `/solana-program/src/lib.rs`

**Key Accounts:**

- **OracleAccount**: Main configuration account
  - Stores admin authority and fee settings
  - Tracks total requests and fees collected
  - PDA: `["oracle"]`

- **RequestAccount**: Data request tracking
  - Created per request by an agent
  - Tracks request status (Pending → Verified → Settled)
  - PDA: `["request", requester, oracle]`

- **ProofAccount**: Verification proof storage
  - Stores SHA256 hash proof of verified data
  - Links to associated request
  - Contains data value and verification timestamp

**Instructions:**

1. **init_oracle(fee_bps, admin)**
   - Initialize oracle with admin and fee configuration
   - Creates OracleAccount

2. **request_data(data_type, quantity)**
   - Agent submits data request
   - Creates RequestAccount with Pending status

3. **fetch_and_verify(data_value, proof_hash, timestamp)**
   - Oracle verifies data with SHA256 proof
   - Creates ProofAccount
   - Updates RequestAccount to Verified

4. **settle_payment(amount)**
   - Process payment with 80/20 split
   - Updates request to Settled
   - Tracks fees in OracleAccount

5. **update_oracle_config(new_fee_bps)**
   - Admin updates fee configuration

### 2. Python Testing Suite

**Location:** `/python-scripts/test_oracle.py`

**Components:**

- **MockSolanaValidator**
  - Simulates Solana validator behavior
  - Manages accounts and instruction logs
  - Tracks transactions

- **OracleProgram**
  - Simulates smart contract instructions
  - Implements request, verify, and settlement logic
  - Manages account state

- **CoingeckoSimulator**
  - Mocks Coingecko API responses
  - Provides realistic price data
  - Simulates network latency

**Workflow:**
1. Initialize oracle
2. Create data request
3. Fetch and verify data
4. Settle payment
5. Output transaction logs

### 3. Web Dashboard (Next.js)

**Location:** `/app` and `/components`

**Pages:**

- **Home (`/`)**: Landing page with features and stats
- **Dashboard (`/dashboard`)**: Main oracle dashboard with real-time feeds
- **Requests (`/requests`)**: Submit and track data requests
- **Feeds (`/feeds`)**: Browse available data feeds
- **Analytics (`/analytics`)**: Fee distribution and performance metrics
- **Settings (`/settings`)**: Admin configuration

**Components:**

- **OracleDashboard**: Main dashboard view
- **DataFeedCard**: Individual feed display
- **RequestForm**: Submit new data requests
- **VerificationProof**: Display proof details
- **TransactionLog**: Payment and settlement history
- **AnalyticsPanel**: Fee distribution and metrics

**Styling:**

- Red and black theme
- Tailwind CSS with custom design tokens
- Dark mode optimized for crypto/blockchain UI
- Responsive design (mobile-first)

## Data Flow

### 1. Request Data Flow

```
Agent                Smart Contract          Oracle              Blockchain
  │                      │                    │                     │
  ├─ request_data() ───> │                    │                     │
  │                      ├─ init RequestAccount                      │
  │                      ├─ verify() ─────────────> validate data    │
  │                      │                    ├─ create proof        │
  │                      │                    ├─ verify hash         │
  │                      │ <─────────────────┤                       │
  │                      ├─ update status ───> Verified             │
  │                      │                                          │
  ├─ settle_payment() ──> │                                         │
  │                      ├─ split fees (80/20)                       │
  │                      ├─ update oracle stats                      │
  │                      │ ────────────────────────> settled         │
```

### 2. Proof Verification Flow

```
Data Input:
  data_value: 19550 (cents)
  data_type: "SOL/USD"
  timestamp: 1699564800

SHA256 Hash Computation:
  input = 19550 || "SOL/USD" || 1699564800
  proof_hash = SHA256(input)

Verification:
  received_proof_hash == computed_proof_hash
  ✓ Data verified and stored

On-Chain State Update:
  RequestAccount.status = Verified
  ProofAccount.proof_hash = hash
  OracleAccount.total_requests += 1
```

### 3. Payment Settlement Flow

```
Payment Amount: 1,000,000 lamports

Fee Split (80/20):
  ├─ Buyback Pool (80%): 800,000 lamports
  └─ Treasury (20%): 200,000 lamports

On-Chain Updates:
  RequestAccount.payment_amount = 1,000,000
  RequestAccount.status = Settled
  OracleAccount.total_fees_collected += 1,000,000

Account Updates:
  ├─ Buyback Pool Account: +800,000
  └─ Treasury Account: +200,000
```

## Security Model

### Account Validation

- All instructions verify correct PDA derivation
- Signer validation for admin-only operations
- Status checks to prevent invalid state transitions

### Proof Verification

- SHA256 hash verification ensures data integrity
- Hash chain prevents tampering
- Timestamp prevents replay attacks

### Fee Limits

- Fee rates capped at 10,000 basis points (100%)
- Prevents excessive fee extraction
- Configurable by admin

## Data Model

### RequestAccount State

```rust
{
  requester: Pubkey,           // Who requested
  data_type: String,           // "SOL/USD"
  quantity: u64,               // Data points
  status: RequestStatus,       // Pending/Verified/Settled
  created_at: i64,            // Unix timestamp
  oracle: Pubkey,             // Oracle reference
  payment_amount: u64,        // Settlement amount
  settled_at: Option<i64>     // Settlement time
}
```

### ProofAccount State

```rust
{
  request: Pubkey,            // Link to request
  oracle: Pubkey,             // Oracle reference
  data_value: u64,            // Verified value
  proof_hash: [u8; 32],       // SHA256 hash
  timestamp: i64,             // Data timestamp
  verified_at: i64            // Verification time
}
```

### OracleAccount State

```rust
{
  admin: Pubkey,              // Admin authority
  fee_bps: u16,               // Fee in basis points
  total_requests: u64,        // Requests processed
  total_fees_collected: u64,  // Fees collected
  bump: u8                    // PDA bump
}
```

## Integration Points

### Smart Contract ↔ Python Tests

- Python uses mock Solana validator
- Simulates instruction execution
- Validates proof verification logic
- Tests fee distribution

### Smart Contract ↔ Web Dashboard

- Dashboard displays oracle data
- Fetches account states via RPC
- Submits transactions (in production)
- Tracks real-time updates

### Web Dashboard ↔ External APIs

- Coingecko API for price data (simulated)
- Solana RPC for blockchain queries
- IPFS for data storage (optional)

## Deployment Architecture

### Local Development

```
solana-test-validator (localhost:8899)
    ↓
Anchor CLI (build & deploy)
    ↓
Python Tests (test_oracle.py)
    ↓
Web Dashboard (http://localhost:3000)
```

### Production (Solana Mainnet)

```
Solana Mainnet RPC
    ↓
Deployed Program (verified bytecode)
    ↓
Oracle Node (off-chain verification)
    ↓
Web Dashboard (deployed on Vercel)
```

## Technology Stack

### Smart Contract
- **Language:** Rust
- **Framework:** Anchor 0.29
- **Runtime:** Solana VM
- **Crypto:** SHA256 (sha2 crate)

### Testing
- **Language:** Python 3.8+
- **SDK:** Solana-py
- **API Client:** requests
- **Data Format:** JSON

### Web Dashboard
- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React hooks + SWR

### Blockchain Network
- **Chain:** Solana
- **RPC Providers:** Alchemy, Helius, QuickNode
- **Tokens:** SOL (for fees), XYBER (native token)

## Performance Considerations

### Smart Contract
- **Account Size Optimization:** Minimal storage for efficiency
- **Compute Budget:** ~3,000 - 5,000 CUs per instruction
- **PDA Derivation:** O(1) account lookup

### Web Dashboard
- **Data Refresh:** 60-second polling intervals
- **Component Rendering:** React.memo for optimization
- **Bundle Size:** ~150KB gzipped

### Throughput
- **TPS:** Limited by Solana mainnet (400+ TPS)
- **Request Latency:** <2s from submission to verification
- **Settlement:** <5s from payment to confirmed

## Extensibility

### Future Enhancements

1. **Multi-Source Data**
   - Support multiple data feeds simultaneously
   - Weighted average verification

2. **Advanced Proof System**
   - Full Sparse Merkle Tree implementation
   - Zero-knowledge proofs

3. **Token Distribution**
   - XYBER token rewards for oracles
   - Stake-based oracle selection

4. **Cross-Chain**
   - Bridge to other blockchains
   - Unified oracle interface

5. **Real-Time Updates**
   - WebSocket support in dashboard
   - Live price feed updates

## Monitoring & Observability

### Key Metrics

- Total requests processed
- Success rate percentage
- Average response time
- Fee distribution amounts
- Request status distribution

### Logging

- Oracle state changes
- Proof verification events
- Payment settlements
- Error conditions
- Admin actions

### Alerts

- High failure rates
- Abnormal fee distribution
- Account balance warnings
- Unusual transaction patterns

