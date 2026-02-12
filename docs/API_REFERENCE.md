# XyData Oracle - API Reference

## Smart Contract Instructions

### init_oracle

Initialize the oracle program with admin authority and fee configuration.

**Instruction Name:** `init_oracle`

**Parameters:**
```rust
pub fn init_oracle(
    ctx: Context<InitOracle>,
    fee_bps: u16,              // Fee in basis points (0-10000)
    admin: Pubkey,             // Admin public key
) -> Result<()>
```

**Accounts Required:**
| Account | Type | Writable | Signer | Description |
|---------|------|----------|--------|-------------|
| oracle | Account | Yes | No | Oracle account (initialized) |
| signer | Signer | Yes | Yes | Payer for account creation |
| system_program | Program | No | No | Solana system program |

**Fee Basis Points:**
- 100 bps = 1%
- 500 bps = 5% (default)
- 10000 bps = 100% (maximum)

**Example:**
```typescript
// Initialize oracle with 5% fee
await program.methods
  .initOracle(500, adminPublicKey)
  .accounts({
    oracle: oraclePDA,
    signer: payer.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc()
```

---

### request_data

Submit a data request to the oracle.

**Instruction Name:** `request_data`

**Parameters:**
```rust
pub fn request_data(
    ctx: Context<RequestData>,
    data_type: String,        // Type of data (e.g., "SOL/USD")
    quantity: u64,            // Number of data points
) -> Result<()>
```

**Accounts Required:**
| Account | Type | Writable | Signer | Description |
|---------|------|----------|--------|-------------|
| request | Account | Yes | No | Request account (initialized) |
| oracle | Account | No | No | Oracle account |
| requester | Signer | Yes | Yes | Requester (payer) |
| system_program | Program | No | No | Solana system program |

**Data Type:**
- String, max 32 characters
- Examples: "SOL/USD", "BTC/USD", "ETH/USD"

**Quantity:**
- Minimum: 1
- Maximum: 1000
- Represents number of data points requested

**Example:**
```typescript
// Request SOL/USD data
await program.methods
  .requestData("SOL/USD", 100)
  .accounts({
    request: requestPDA,
    oracle: oraclePDA,
    requester: agent.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc()
```

---

### fetch_and_verify

Oracle fetches data and creates verification proof.

**Instruction Name:** `fetch_and_verify`

**Parameters:**
```rust
pub fn fetch_and_verify(
    ctx: Context<FetchAndVerify>,
    data_value: u64,          // Verified data value
    proof_hash: [u8; 32],     // SHA256 proof hash
    timestamp: i64,           // Unix timestamp
) -> Result<()>
```

**Accounts Required:**
| Account | Type | Writable | Signer | Description |
|---------|------|----------|--------|-------------|
| proof | Account | Yes | No | Proof account (initialized) |
| request | Account | Yes | No | Request account (Pending) |
| oracle | Account | No | No | Oracle account |
| signer | Signer | No | Yes | Must be oracle admin |

**Data Value:**
- Value in smallest units (e.g., cents for USD prices)
- SOL price 195.50 → value = 19550

**Proof Hash:**
- SHA256 hash of: `data_value || data_type || timestamp`
- 32-byte array

**Timestamp:**
- Unix timestamp (seconds since epoch)
- Must be recent (within 5 minutes)

**Example:**
```typescript
// Verify data with proof
const proofHash = sha256(
  Buffer.concat([
    Buffer.from(dataValue.toString()),
    Buffer.from("SOL/USD"),
    Buffer.from(timestamp.toString()),
  ])
);

await program.methods
  .fetchAndVerify(dataValue, Array.from(proofHash), timestamp)
  .accounts({
    proof: proofPDA,
    request: requestPDA,
    oracle: oraclePDA,
    signer: oracle.publicKey,
  })
  .rpc()
```

**Verification Logic:**
```
1. Compute hash = SHA256(data_value || data_type || timestamp)
2. Compare: hash == proof_hash
3. If match: Request status → Verified
4. If no match: Instruction fails with ProofVerificationFailed error
```

---

### settle_payment

Settle payment for a verified data request with fee distribution.

**Instruction Name:** `settle_payment`

**Parameters:**
```rust
pub fn settle_payment(
    ctx: Context<SettlePayment>,
    amount: u64,               // Payment amount in lamports
) -> Result<()>
```

**Accounts Required:**
| Account | Type | Writable | Signer | Description |
|---------|------|----------|--------|-------------|
| proof | Account | No | No | Associated proof account |
| request | Account | Yes | No | Request account (Verified) |
| oracle | Account | Yes | No | Oracle account |
| signer | Signer | No | Yes | Transaction signer |

**Amount:**
- In lamports (1 SOL = 1,000,000 lamports)
- Minimum: 1 lamport
- No maximum (limited by account balance)

**Fee Distribution:**
- 80% → Buyback pool
- 20% → Treasury

**Example:**
```typescript
// Settle payment (1 SOL)
const amount = 1_000_000; // 1 SOL in lamports

await program.methods
  .settlePayment(new BN(amount))
  .accounts({
    proof: proofPDA,
    request: requestPDA,
    oracle: oraclePDA,
    signer: payer.publicKey,
  })
  .rpc()
```

**Fee Calculation Example:**
```
Payment: 1,000,000 lamports
Buyback: 1,000,000 * 80 / 100 = 800,000 lamports
Treasury: 1,000,000 * 20 / 100 = 200,000 lamports
```

---

### update_oracle_config

Update oracle configuration (admin only).

**Instruction Name:** `update_oracle_config`

**Parameters:**
```rust
pub fn update_oracle_config(
    ctx: Context<UpdateOracleConfig>,
    new_fee_bps: u16,          // New fee in basis points
) -> Result<()>
```

**Accounts Required:**
| Account | Type | Writable | Signer | Description |
|---------|------|----------|--------|-------------|
| oracle | Account | Yes | No | Oracle account |
| signer | Signer | No | Yes | Must be oracle admin |

**New Fee (basis points):**
- 0-10000 (0% to 100%)
- 100 = 1%
- 500 = 5%
- 10000 = 100%

**Example:**
```typescript
// Update fee to 7.5% (750 bps)
await program.methods
  .updateOracleConfig(750)
  .accounts({
    oracle: oraclePDA,
    signer: admin.publicKey,
  })
  .rpc()
```

---

## Data Structures

### OracleAccount

```rust
pub struct OracleAccount {
    pub admin: Pubkey,                 // Admin authority
    pub fee_bps: u16,                  // Fee in basis points
    pub total_requests: u64,           // Total requests processed
    pub total_fees_collected: u64,     // Total fees collected (lamports)
    pub bump: u8,                      // PDA bump seed
}
```

**Size:** 8 + 32 + 2 + 8 + 8 + 1 = 59 bytes

**PDA:** `["oracle"]`

### RequestAccount

```rust
pub struct RequestAccount {
    pub requester: Pubkey,             // Requester address
    pub oracle: Pubkey,                // Oracle address
    pub data_type: String,             // Type of data
    pub quantity: u64,                 // Quantity requested
    pub status: RequestStatus,         // Request status
    pub created_at: i64,               // Creation timestamp
    pub payment_amount: u64,           // Payment amount (lamports)
    pub settled_at: Option<i64>,       // Settlement timestamp
}
```

**PDA:** `["request", requester, oracle]`

### ProofAccount

```rust
pub struct ProofAccount {
    pub request: Pubkey,               // Associated request
    pub oracle: Pubkey,                // Oracle address
    pub data_value: u64,               // Verified data value
    pub proof_hash: [u8; 32],          // SHA256 proof hash
    pub timestamp: i64,                // Data timestamp
    pub verified_at: i64,              // Verification timestamp
}
```

### RequestStatus Enum

```rust
pub enum RequestStatus {
    Pending,   // 0 - Awaiting verification
    Verified,  // 1 - Data verified, proof created
    Settled,   // 2 - Payment settled
    Rejected,  // 3 - Request rejected
}
```

---

## Error Codes

| Error | Code | Description |
|-------|------|-------------|
| Unauthorized | 0 | Only admin can call this instruction |
| InvalidDataType | 1 | Data type string too long (max 32 chars) |
| InvalidQuantity | 2 | Quantity must be > 0 |
| InvalidRequestStatus | 3 | Request not in correct status |
| ProofVerificationFailed | 4 | Proof hash doesn't match computed hash |
| ProofMismatch | 5 | Proof and request don't match |
| InvalidFee | 6 | Fee exceeds 10000 bps (100%) |

---

## PDA (Program Derived Address) Reference

### Oracle PDA

```
seeds: [b"oracle"]
program: xy_data_oracle
```

**Used for:** Storing oracle configuration and statistics

### Request PDA

```
seeds: [b"request", requester_pubkey, oracle_pubkey]
program: xy_data_oracle
```

**Used for:** Tracking individual data requests

### Proof PDA

```
seeds: [b"proof", request_pubkey]
program: xy_data_oracle
```

**Used for:** Storing verification proofs

---

## Integration Examples

### TypeScript with Anchor

```typescript
import * as anchor from "@coral-xyz/anchor";
import { XyDataOracle } from "./idl/xy_data_oracle";
import { SystemProgram } from "@solana/web3.js";

const program = anchor.workspace.XyDataOracle as Program<XyDataOracle>;

// Initialize oracle
async function initializeOracle(adminPubkey: PublicKey) {
  const [oraclePDA] = await PublicKey.findProgramAddress(
    [Buffer.from("oracle")],
    program.programId
  );

  const tx = await program.methods
    .initOracle(500, adminPubkey)
    .accounts({
      oracle: oraclePDA,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

// Request data
async function requestData(requesterPubkey: PublicKey) {
  const [oraclePDA] = await PublicKey.findProgramAddress(
    [Buffer.from("oracle")],
    program.programId
  );

  const [requestPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("request"), requesterPubkey, oraclePDA],
    program.programId
  );

  const tx = await program.methods
    .requestData("SOL/USD", 100)
    .accounts({
      request: requestPDA,
      oracle: oraclePDA,
      requester: requesterPubkey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}
```

### Python Integration

```python
from solana.publickey import PublicKey
from solana.system_program import sys_program_id
import hashlib

# Initialize oracle
def init_oracle(client, admin_pubkey, fee_bps=500):
    oracle_pda = PublicKey.find_program_address(
        [b"oracle"],
        PROGRAM_ID
    )[0]
    
    tx = program.methods
        .init_oracle(fee_bps, admin_pubkey)
        .accounts({
            "oracle": oracle_pda,
            "signer": client.public_key,
            "systemProgram": sys_program_id(),
        })
        .rpc()
    
    return tx

# Request data
def request_data(client, requester_pubkey, data_type, quantity):
    oracle_pda = PublicKey.find_program_address([b"oracle"], PROGRAM_ID)[0]
    request_pda = PublicKey.find_program_address(
        [b"request", requester_pubkey, oracle_pda],
        PROGRAM_ID
    )[0]
    
    tx = program.methods
        .request_data(data_type, quantity)
        .accounts({
            "request": request_pda,
            "oracle": oracle_pda,
            "requester": requester_pubkey,
            "systemProgram": sys_program_id(),
        })
        .rpc()
    
    return tx
```

---

## Request/Response Examples

### Request Data Flow

```
1. Agent calls request_data("SOL/USD", 100)
   └─ Creates RequestAccount with status=Pending

2. Oracle calls fetch_and_verify(19550, proof_hash, timestamp)
   └─ Verifies proof
   └─ Creates ProofAccount
   └─ Updates RequestAccount status=Verified

3. Payer calls settle_payment(1000000)
   └─ Updates RequestAccount status=Settled
   └─ Increments OracleAccount.total_fees_collected
```

### Data Verification Example

```
Input:
  Data Value: 19550 (SOL price in cents: $195.50)
  Data Type: "SOL/USD"
  Timestamp: 1699564800

Proof Generation:
  message = concat(19550, "SOL/USD", 1699564800)
  proof_hash = SHA256(message)
  // = 0x3a4f2c8d1e9b6a5c2f7d8e3a1b4c6f9e...

Verification:
  computed_hash = SHA256(concat(19550, "SOL/USD", 1699564800))
  if (computed_hash == proof_hash) {
    ✓ Verified
  } else {
    ✗ ProofVerificationFailed
  }
```

---

## Rate Limiting & Costs

### Transaction Costs

| Operation | CU Used | SOL Cost* |
|-----------|---------|-----------|
| init_oracle | 2,500 | ~0.001 |
| request_data | 3,000 | ~0.0012 |
| fetch_and_verify | 3,500 | ~0.0014 |
| settle_payment | 2,000 | ~0.0008 |
| update_oracle_config | 1,500 | ~0.0006 |

*Approximate costs (varies with network congestion)

### Limits

- **Max Data Type Length:** 32 characters
- **Max Quantity:** 1,000,000
- **Max Fee:** 10,000 basis points (100%)
- **Max Proof Hash:** 32 bytes (SHA256 output)
- **Min Timestamp:** Must be recent (<5 minutes old)

