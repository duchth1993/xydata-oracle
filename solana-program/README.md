# XyData Oracle Smart Contract

## Overview

The XyData Oracle is a decentralized data marketplace built on Solana using the Anchor framework. It enables agents to request verified data feeds (e.g., SOL/USD prices), processes oracle verification with cryptographic proofs, and settles payments with a configurable fee split (default: 80% buyback, 20% treasury).

## Architecture

### Core Accounts

1. **OracleAccount** - Main oracle configuration and statistics
   - Stores admin authority and fee parameters
   - Tracks total requests and fees collected
   - Identified by PDA seed: `["oracle"]`

2. **RequestAccount** - Individual data request tracking
   - Requester's public key and data type (e.g., "SOL/USD")
   - Status: Pending → Verified → Settled
   - PDA seed: `["request", requester, oracle]`

3. **ProofAccount** - Verification proof storage
   - Contains SHA256 proof hash of verified data
   - Links to corresponding request
   - Stores data value and verification timestamp

### Instructions

#### 1. `init_oracle`
Initializes the oracle contract with an admin authority.

**Parameters:**
- `fee_bps` (u16): Fee in basis points (0-10000, where 100 = 1%)
- `admin` (Pubkey): Admin authority for the oracle

**Accounts:**
- `oracle`: Oracle account (initialized)
- `signer`: Payer for account creation
- `system_program`: Solana system program

#### 2. `request_data`
Agent submits a request for data verification.

**Parameters:**
- `data_type` (String): Type of data requested (max 32 chars, e.g., "SOL/USD")
- `quantity` (u64): Quantity of data requested

**Accounts:**
- `request`: Request account (initialized)
- `oracle`: Oracle account
- `requester`: Request signer/payer
- `system_program`: Solana system program

**Status:** Creates request with `Pending` status

#### 3. `fetch_and_verify`
Oracle verifies data with a cryptographic proof. Simulates fetching from Coingecko API and storing proof.

**Parameters:**
- `data_value` (u64): The data value (e.g., SOL price in cents)
- `proof_hash` ([u8; 32]): SHA256 hash of the proof
- `timestamp` (i64): Data timestamp

**Accounts:**
- `proof`: Proof account (must be initialized first)
- `request`: Request account to update
- `oracle`: Oracle account
- `signer`: Must be oracle admin

**Verification:** Uses SHA256 hash verification to simulate Sparse Merkle Tree proof validation

**Status:** Updates request to `Verified`

#### 4. `settle_payment`
Settles payment for a verified data request with fee distribution.

**Parameters:**
- `amount` (u64): Total payment amount in lamports

**Accounts:**
- `proof`: Associated proof account
- `request`: Request account to update
- `oracle`: Oracle account to update
- `signer`: Transaction signer

**Payment Split:**
- 80% → Buyback pool
- 20% → Treasury

**Status:** Updates request to `Settled`

#### 5. `update_oracle_config`
Admin updates oracle configuration (fee rate).

**Parameters:**
- `new_fee_bps` (u16): New fee in basis points (0-10000)

**Accounts:**
- `oracle`: Oracle account
- `signer`: Must be oracle admin

## Request Status Flow

```
Pending → Verified → Settled
  ↓
Rejected (optional)
```

- **Pending**: Initial state after `request_data`
- **Verified**: After oracle calls `fetch_and_verify` with valid proof
- **Settled**: After `settle_payment` is called
- **Rejected**: If verification fails or request is cancelled

## Proof Verification

The contract uses SHA256 hash-based verification to simulate a Sparse Merkle Tree (SMT) proof:

1. Oracle computes: `SHA256(data_value || data_type || timestamp)`
2. This hash is verified against the provided `proof_hash`
3. If they match, the data is considered verified

In a production system, this would use a full SMT implementation for more complex data structures.

## Fee Structure

Default fee: 500 basis points (5%)

Fee distribution (configurable):
- **80%** → Buyback pool (XYBER token buyback)
- **20%** → Treasury (protocol operations)

## Building

### Prerequisites
- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.29+

### Compile
```bash
cd solana-program
anchor build
```

### Deploy to localnet
```bash
solana-test-validator &
anchor deploy
```

### Deploy to devnet/mainnet
```bash
solana config set --url https://api.devnet.solana.com
anchor deploy
```

## Testing

See `../python-scripts/test_oracle.py` for complete test suite demonstrating:
- Oracle initialization
- Data request creation
- Data verification with proof
- Payment settlement
- Fee distribution

Run tests:
```bash
cd python-scripts
pip install -r requirements.txt
python test_oracle.py
```

## Security Considerations

1. **Admin Checks**: Only oracle admin can call `fetch_and_verify` and `update_oracle_config`
2. **Status Validation**: Requests must be in correct status for each operation
3. **Proof Verification**: Hash-based verification prevents invalid data acceptance
4. **Fee Limits**: Fee rates capped at 10000 basis points (100%)

## Integration with Xyber

The XyData Oracle integrates with the Xyber ecosystem:

1. **Payment Token**: Uses XYBER tokens for fee settlements
2. **Buyback Mechanism**: 80% of fees fund XYBER token buyback
3. **Treasury**: 20% of fees support protocol operations
4. **Agent Network**: Agents submit data requests and settle with XYBER

## Further Reading

- See `ARCHITECTURE.md` for system design
- See `DEPLOYMENT.md` for deployment guide
- See `API_REFERENCE.md` for detailed API documentation
