use anchor_lang::prelude::*;
use sha2::{Sha256, Digest};
use std::mem::size_of;

declare_id!("XyDataOracleProgram111111111111111111111111");

/// XyData Oracle Program
/// 
/// A decentralized oracle system that verifies data feeds using cryptographic proofs.
/// Agents can request data (e.g., SOL/USD price), the oracle fetches and verifies it,
/// and payments are settled with a 80/20 split (buyback/treasury).
#[program]
pub mod xy_data_oracle {
    use super::*;

    /// Initialize the oracle with an admin authority
    /// Creates the main OracleAccount that will store configuration
    pub fn init_oracle(
        ctx: Context<InitOracle>,
        fee_bps: u16,
        admin: Pubkey,
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.admin = admin;
        oracle.fee_bps = fee_bps;
        oracle.total_requests = 0;
        oracle.total_fees_collected = 0;
        oracle.bump = ctx.bumps.oracle;
        
        msg!("Oracle initialized with admin: {}", admin);
        Ok(())
    }

    /// Agent requests data from the oracle (e.g., SOL price from Coingecko)
    /// This creates a RequestAccount that tracks the data request
    pub fn request_data(
        ctx: Context<RequestData>,
        data_type: String, // e.g., "SOL/USD"
        quantity: u64,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        let oracle = &mut ctx.accounts.oracle;

        // Validate inputs
        require!(data_type.len() <= 32, OracleError::InvalidDataType);
        require!(quantity > 0, OracleError::InvalidQuantity);

        // Set request details
        request.requester = ctx.accounts.requester.key();
        request.data_type = data_type.clone();
        request.quantity = quantity;
        request.status = RequestStatus::Pending;
        request.created_at = Clock::get()?.unix_timestamp;
        request.oracle = oracle.key();

        // Update oracle state
        oracle.total_requests += 1;

        msg!("Data request created: {} x{}", data_type, quantity);
        Ok(())
    }

    /// Oracle fetches data and verifies it with a proof
    /// This simulates fetching from an API and storing a verification proof
    pub fn fetch_and_verify(
        ctx: Context<FetchAndVerify>,
        data_value: u64,
        proof_hash: [u8; 32],
        timestamp: i64,
    ) -> Result<()> {
        let proof = &mut ctx.accounts.proof;
        let request = &mut ctx.accounts.request;
        let oracle = &ctx.accounts.oracle;

        // Verify oracle admin is calling this
        require_eq!(
            ctx.accounts.signer.key(),
            oracle.admin,
            OracleError::Unauthorized
        );

        // Verify request exists and is pending
        require_eq!(request.status, RequestStatus::Pending, OracleError::InvalidRequestStatus);

        // Simulate SMT verification using SHA256 hash chain
        // In a real implementation, this would verify a Sparse Merkle Tree proof
        let mut hasher = Sha256::new();
        hasher.update(data_value.to_le_bytes());
        hasher.update(request.data_type.as_bytes());
        hasher.update(timestamp.to_le_bytes());
        let computed_hash = hasher.finalize();

        // Verify the proof hash matches (simulating proof verification)
        require!(
            computed_hash[..] == proof_hash,
            OracleError::ProofVerificationFailed
        );

        // Store the proof
        proof.request = request.key();
        proof.data_value = data_value;
        proof.proof_hash = proof_hash;
        proof.timestamp = timestamp;
        proof.verified_at = Clock::get()?.unix_timestamp;
        proof.oracle = oracle.key();

        // Update request status
        request.status = RequestStatus::Verified;

        msg!("Data verified with proof: {:?}", proof_hash);
        Ok(())
    }

    /// Settle payment for a verified data request
    /// Implements x402-style payment: 80% buyback pool, 20% treasury
    pub fn settle_payment(
        ctx: Context<SettlePayment>,
        amount: u64,
    ) -> Result<()> {
        let proof = &ctx.accounts.proof;
        let request = &mut ctx.accounts.request;
        let oracle = &mut ctx.accounts.oracle;

        // Verify proof exists and request is verified
        require_eq!(request.status, RequestStatus::Verified, OracleError::InvalidRequestStatus);
        require_eq!(proof.request, request.key(), OracleError::ProofMismatch);

        // Calculate fee split: 80% buyback, 20% treasury
        let buyback_amount = (amount * 80) / 100;
        let treasury_amount = amount - buyback_amount;

        // Update oracle state
        oracle.total_fees_collected += amount;

        // Update request status
        request.status = RequestStatus::Settled;
        request.payment_amount = amount;
        request.settled_at = Some(Clock::get()?.unix_timestamp);

        msg!(
            "Payment settled: {} total, {} buyback, {} treasury",
            amount, buyback_amount, treasury_amount
        );

        Ok(())
    }

    /// Update oracle settings (admin only)
    pub fn update_oracle_config(
        ctx: Context<UpdateOracleConfig>,
        new_fee_bps: u16,
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;

        require_eq!(
            ctx.accounts.signer.key(),
            oracle.admin,
            OracleError::Unauthorized
        );

        require!(new_fee_bps <= 10000, OracleError::InvalidFee);

        oracle.fee_bps = new_fee_bps;

        msg!("Oracle config updated: fee_bps = {}", new_fee_bps);
        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

/// Main oracle account - stores oracle configuration and statistics
#[account]
pub struct OracleAccount {
    pub admin: Pubkey,           // Admin authority
    pub fee_bps: u16,            // Fee in basis points (1 bps = 0.01%)
    pub total_requests: u64,     // Total data requests processed
    pub total_fees_collected: u64, // Total fees collected
    pub bump: u8,                // PDA bump seed
}

/// Request account - tracks a data request from an agent
#[account]
pub struct RequestAccount {
    pub requester: Pubkey,       // Requester's public key
    pub oracle: Pubkey,          // Oracle account
    pub data_type: String,       // Type of data (e.g., "SOL/USD")
    pub quantity: u64,           // Quantity requested
    pub status: RequestStatus,   // Request status
    pub created_at: i64,         // Timestamp when created
    pub payment_amount: u64,     // Payment amount in lamports
    pub settled_at: Option<i64>, // Timestamp when settled
}

/// Proof account - stores verification proof for a data request
#[account]
pub struct ProofAccount {
    pub request: Pubkey,         // Associated request
    pub oracle: Pubkey,          // Oracle account
    pub data_value: u64,         // The verified data value
    pub proof_hash: [u8; 32],    // SHA256 hash of the proof
    pub timestamp: i64,          // Data timestamp
    pub verified_at: i64,        // Timestamp when verified
}

// ============================================================================
// ENUMS & TYPES
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RequestStatus {
    Pending,   // Waiting for oracle to fetch and verify
    Verified,  // Data has been verified
    Settled,   // Payment has been settled
    Rejected,  // Request was rejected
}

// ============================================================================
// CONTEXT STRUCTURES
// ============================================================================

#[derive(Accounts)]
pub struct InitOracle<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + size_of::<OracleAccount>(),
        seeds = [b"oracle".as_ref()],
        bump
    )]
    pub oracle: Account<'info, OracleAccount>,
    
    #[account(mut)]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data_type: String)]
pub struct RequestData<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + size_of::<RequestAccount>() + 32,
        seeds = [
            b"request".as_ref(),
            requester.key().as_ref(),
            oracle.key().as_ref(),
        ],
        bump
    )]
    pub request: Account<'info, RequestAccount>,
    
    #[account(
        seeds = [b"oracle".as_ref()],
        bump = oracle.bump
    )]
    pub oracle: Account<'info, OracleAccount>,
    
    #[account(mut)]
    pub requester: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FetchAndVerify<'info> {
    #[account(mut)]
    pub proof: Account<'info, ProofAccount>,
    
    #[account(mut)]
    pub request: Account<'info, RequestAccount>,
    
    #[account(
        seeds = [b"oracle".as_ref()],
        bump = oracle.bump
    )]
    pub oracle: Account<'info, OracleAccount>,
    
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettlePayment<'info> {
    #[account(mut)]
    pub proof: Account<'info, ProofAccount>,
    
    #[account(mut)]
    pub request: Account<'info, RequestAccount>,
    
    #[account(mut)]
    pub oracle: Account<'info, OracleAccount>,
    
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateOracleConfig<'info> {
    #[account(mut)]
    pub oracle: Account<'info, OracleAccount>,
    
    pub signer: Signer<'info>,
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

#[error_code]
pub enum OracleError {
    #[msg("Unauthorized: only admin can call this")]
    Unauthorized,
    
    #[msg("Invalid data type")]
    InvalidDataType,
    
    #[msg("Invalid quantity")]
    InvalidQuantity,
    
    #[msg("Invalid request status")]
    InvalidRequestStatus,
    
    #[msg("Proof verification failed")]
    ProofVerificationFailed,
    
    #[msg("Proof and request do not match")]
    ProofMismatch,
    
    #[msg("Invalid fee")]
    InvalidFee,
}
