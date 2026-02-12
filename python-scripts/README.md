# XyData Oracle - Python Testing Suite

## Overview

This directory contains Python scripts for testing and interacting with the XyData Oracle smart contract. The test suite demonstrates the complete oracle workflow without requiring a live Solana blockchain.

## Files

### `test_oracle.py`
Complete test suite demonstrating the full oracle workflow:

1. **Initialize Oracle** - Setup oracle with admin authority and fee configuration
2. **Request Data** - Agent submits a data request (e.g., SOL/USD)
3. **Fetch and Verify** - Oracle fetches data and creates cryptographic proof
4. **Settle Payment** - Process payment with 80/20 fee split

#### Components:

**MockSolanaValidator**
- Simulates Solana validator behavior
- Manages accounts and instruction logs
- Tracks all state changes

**OracleProgram**
- Simulates the on-chain smart contract
- Implements all oracle instructions
- Manages oracle, request, and proof accounts

**CoingeckoSimulator**
- Mocks Coingecko API responses
- Provides realistic price data
- Simulates network latency

### `requirements.txt`
Python dependencies:
- `solana`: Solana Python SDK (for real deployments)
- `web3`: Web3.py library
- `requests`: HTTP library
- `python-dotenv`: Environment variable management
- `pydantic`: Data validation

### `deploy.sh`
Interactive deployment helper script with options for:
- Checking requirements
- Installing dependencies
- Running tests
- Building smart contract
- Deploying to localnet

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Optional: Solana CLI and Anchor (for on-chain deployment)

### Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Verify installation:**
   ```bash
   python3 test_oracle.py
   ```

## Running Tests

### Test-Only (No blockchain required)
```bash
python3 test_oracle.py
```

This runs the complete oracle workflow simulation:
- Creates oracle account
- Submits data request
- Fetches and verifies data with SHA256 proof
- Settles payment with fee splitting
- Displays transaction logs and statistics

**Output:**
```
======================================================================
XyData Oracle - Complete Workflow Demonstration
======================================================================

[STEP 1] Initialize Oracle
------ ...
✓ Oracle initialized:
   Admin: oracle_admin_key_123
   Fee: 500 bps (5.0%)

[STEP 2] Agent Requests Data
------...
📊 Data request created:
   Request ID: request_agent_key_xyz_0
   Requester: agent_key_xyz
   Type: SOL/USD
   Quantity: 1
   Status: Pending

... [continues with verification and settlement] ...

[SUMMARY]
======================================================================
📊 Oracle Statistics:
   Total Requests: 1
   Total Fees Collected: 1000000 lamports

... [additional details] ...
```

### Using Deploy Script

**Interactive Menu:**
```bash
bash deploy.sh
```

**Direct Commands:**
```bash
bash deploy.sh test      # Run tests
bash deploy.sh build     # Build contract (requires Anchor)
bash deploy.sh deploy    # Deploy to localnet
bash deploy.sh setup     # Install dependencies
```

## Workflow Details

### Data Request Flow

```
1. INIT_ORACLE
   └─ Creates OracleAccount with admin and fee config

2. REQUEST_DATA
   └─ Agent submits data request
   └─ Creates RequestAccount with status=Pending

3. FETCH_AND_VERIFY
   └─ Oracle fetches data (from Coingecko)
   └─ Computes SHA256 proof hash
   └─ Verifies proof matches expected hash
   └─ Creates ProofAccount
   └─ Updates RequestAccount to status=Verified

4. SETTLE_PAYMENT
   └─ Process payment
   └─ Split: 80% buyback, 20% treasury
   └─ Update RequestAccount to status=Settled
   └─ Update Oracle statistics
```

### Account States

**RequestAccount Status Flow:**
```
Pending → Verified → Settled
```

**Data Structure Example:**
```python
{
    "requester": "agent_key_xyz",
    "data_type": "SOL/USD",
    "quantity": 1,
    "status": "Settled",
    "created_at": 1699564800,
    "payment_amount": 1000000,  # lamports
    "settled_at": 1699564820
}
```

## Fee Distribution

Default fee: 500 basis points (5%)

**Payment Splitting (for 1 SOL payment):**
```
Total Payment: 1,000,000 lamports
├─ Buyback Pool (80%): 800,000 lamports
└─ Treasury (20%): 200,000 lamports
```

## Integration with Smart Contract

The Python test suite mirrors the on-chain Anchor contract:

| Python Test | Anchor Instruction |
|-------------|-------------------|
| `init_oracle()` | `init_oracle` |
| `request_data()` | `request_data` |
| `fetch_and_verify()` | `fetch_and_verify` |
| `settle_payment()` | `settle_payment` |

## Testing on Localnet

To test against a real Solana validator:

1. **Start localnet:**
   ```bash
   solana-test-validator
   ```

2. **Build and deploy contract:**
   ```bash
   cd ../solana-program
   anchor build
   anchor deploy
   ```

3. **Update test script with contract IDs** from deployment output

4. **Run tests against localnet:**
   ```bash
   python3 test_oracle.py
   ```

## Proof Verification

The test suite uses SHA256 hash-based verification:

```python
# Proof input
proof_input = data_value.encode() + data_type.encode() + timestamp.encode()

# Computed hash
proof_hash = SHA256(proof_input)

# Verification
is_valid = proof_hash == received_proof_hash
```

This simulates a Sparse Merkle Tree (SMT) proof system for data verification.

## Environment Variables

Optional configuration via `.env` file:

```
# Solana RPC endpoint
SOLANA_RPC_URL=http://localhost:8899

# Program ID (for on-chain testing)
PROGRAM_ID=XyDataOracleProgram111111111111111111111111

# Test mode (true for mock, false for real chain)
TEST_MODE=true
```

## Troubleshooting

### ImportError: No module named 'solana'
```bash
pip install -r requirements.txt
```

### Permission denied on deploy.sh
```bash
chmod +x deploy.sh
```

### Tests fail with "Proof verification failed"
- Ensure test_oracle.py is using consistent hash functions
- Check that data values and timestamps are properly encoded

## Further Reading

- `../solana-program/README.md` - Smart contract documentation
- `../docs/ARCHITECTURE.md` - System architecture
- `../docs/DEPLOYMENT.md` - Complete deployment guide

## License

MIT License - See LICENSE file for details
