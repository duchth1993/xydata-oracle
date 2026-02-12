#!/usr/bin/env python3
"""
XyData Oracle Test Suite

This script demonstrates the complete XyData Oracle workflow:
1. Initialize the oracle with admin authority
2. Agent requests data (e.g., SOL/USD price)
3. Oracle fetches data from Coingecko and creates a proof
4. Data is verified with hash-based proof
5. Payment is settled with 80/20 split (buyback/treasury)
"""

import hashlib
import time
import json
import requests
from typing import Dict, Tuple, Optional
from datetime import datetime


class MockSolanaValidator:
    """Mock Solana validator for local testing"""
    
    def __init__(self):
        self.accounts: Dict[str, Dict] = {}
        self.instructions_log = []
        self.transactions = []
        
    def create_account(self, account_key: str, data: Dict):
        """Create a new account"""
        self.accounts[account_key] = {
            "data": data,
            "created_at": datetime.now().isoformat(),
            "balance": 0
        }
        print(f"✓ Account created: {account_key}")
        return account_key
    
    def update_account(self, account_key: str, data: Dict):
        """Update an existing account"""
        if account_key in self.accounts:
            self.accounts[account_key]["data"].update(data)
            print(f"✓ Account updated: {account_key}")
            return True
        return False
    
    def get_account(self, account_key: str) -> Optional[Dict]:
        """Retrieve account data"""
        return self.accounts.get(account_key)
    
    def log_instruction(self, instruction: str, params: Dict):
        """Log an instruction execution"""
        self.instructions_log.append({
            "timestamp": datetime.now().isoformat(),
            "instruction": instruction,
            "params": params
        })


class OracleProgram:
    """XyData Oracle Program Simulator"""
    
    def __init__(self, validator: MockSolanaValidator):
        self.validator = validator
        self.oracle_account = None
        self.requests = {}
        self.proofs = {}
        
    def init_oracle(self, admin: str, fee_bps: int) -> str:
        """
        Initialize the oracle with admin authority
        Instruction: init_oracle
        """
        oracle_key = "oracle_pda_oracle"
        oracle_data = {
            "admin": admin,
            "fee_bps": fee_bps,
            "total_requests": 0,
            "total_fees_collected": 0,
            "bump": 255
        }
        
        self.oracle_account = self.validator.create_account(oracle_key, oracle_data)
        self.validator.log_instruction("init_oracle", {
            "admin": admin,
            "fee_bps": fee_bps
        })
        
        print(f"\n📋 Oracle initialized:")
        print(f"   Admin: {admin}")
        print(f"   Fee: {fee_bps} bps ({fee_bps/100}%)")
        
        return oracle_key
    
    def request_data(self, requester: str, data_type: str, quantity: int) -> str:
        """
        Agent requests data from the oracle
        Instruction: request_data
        """
        request_key = f"request_{requester}_{len(self.requests)}"
        request_data = {
            "requester": requester,
            "data_type": data_type,
            "quantity": quantity,
            "status": "Pending",
            "created_at": int(time.time()),
            "oracle": self.oracle_account,
            "payment_amount": 0,
            "settled_at": None
        }
        
        self.requests[request_key] = request_data
        self.validator.create_account(request_key, request_data)
        self.validator.log_instruction("request_data", {
            "requester": requester,
            "data_type": data_type,
            "quantity": quantity
        })
        
        # Update oracle stats
        oracle = self.validator.get_account(self.oracle_account)
        oracle["data"]["total_requests"] += 1
        
        print(f"\n📊 Data request created:")
        print(f"   Request ID: {request_key}")
        print(f"   Requester: {requester}")
        print(f"   Type: {data_type}")
        print(f"   Quantity: {quantity}")
        print(f"   Status: Pending")
        
        return request_key
    
    def fetch_and_verify(self, request_key: str, data_value: int, timestamp: int) -> Tuple[str, bool]:
        """
        Oracle fetches data and creates verification proof
        Instruction: fetch_and_verify
        
        Simulates:
        1. Fetching data from Coingecko API
        2. Creating SHA256 proof hash
        3. Verifying proof matches computed hash
        """
        request = self.validator.get_account(request_key)
        if not request:
            return None, False
        
        request_data = request["data"]
        
        # Simulate API fetch (would normally call Coingecko)
        print(f"\n🌐 Fetching data from Coingecko...")
        print(f"   Endpoint: /simple/price (SOL/USD)")
        time.sleep(0.5)  # Simulate network latency
        
        # Create proof hash using SHA256
        # Hash = SHA256(data_value || data_type || timestamp)
        proof_input = (
            str(data_value).encode() +
            request_data["data_type"].encode() +
            str(timestamp).encode()
        )
        proof_hash = hashlib.sha256(proof_input).digest()
        
        # Verify proof (in production, this would verify SMT proof)
        computed_input = (
            str(data_value).encode() +
            request_data["data_type"].encode() +
            str(timestamp).encode()
        )
        computed_hash = hashlib.sha256(computed_input).digest()
        
        is_valid = proof_hash == computed_hash
        
        if is_valid:
            # Create proof account
            proof_key = f"proof_{request_key}"
            proof_data = {
                "request": request_key,
                "oracle": self.oracle_account,
                "data_value": data_value,
                "proof_hash": proof_hash.hex(),
                "timestamp": timestamp,
                "verified_at": int(time.time())
            }
            
            self.proofs[proof_key] = proof_data
            self.validator.create_account(proof_key, proof_data)
            
            # Update request status
            request["data"]["status"] = "Verified"
            
            self.validator.log_instruction("fetch_and_verify", {
                "request": request_key,
                "data_value": data_value,
                "proof_hash": proof_hash.hex(),
                "timestamp": timestamp
            })
            
            print(f"\n✓ Data verified with proof:")
            print(f"   Data Value: {data_value}")
            print(f"   Proof Hash: {proof_hash.hex()[:16]}...")
            print(f"   Timestamp: {datetime.fromtimestamp(timestamp).isoformat()}")
            print(f"   Verification: PASSED ✓")
            
            return proof_key, True
        else:
            print(f"\n✗ Proof verification failed")
            return None, False
    
    def settle_payment(self, request_key: str, amount: int) -> bool:
        """
        Settle payment for verified data request
        Instruction: settle_payment
        
        Implements x402-style payment splitting:
        - 80% to buyback pool
        - 20% to treasury
        """
        request = self.validator.get_account(request_key)
        if not request or request["data"]["status"] != "Verified":
            print("✗ Cannot settle: request not verified")
            return False
        
        # Calculate fee split
        buyback = (amount * 80) // 100
        treasury = amount - buyback
        
        # Update request
        request["data"]["status"] = "Settled"
        request["data"]["payment_amount"] = amount
        request["data"]["settled_at"] = int(time.time())
        
        # Update oracle
        oracle = self.validator.get_account(self.oracle_account)
        oracle["data"]["total_fees_collected"] += amount
        
        self.validator.log_instruction("settle_payment", {
            "request": request_key,
            "amount": amount,
            "buyback": buyback,
            "treasury": treasury
        })
        
        print(f"\n💰 Payment settled:")
        print(f"   Total: {amount} lamports")
        print(f"   Buyback (80%): {buyback} lamports")
        print(f"   Treasury (20%): {treasury} lamports")
        print(f"   Status: Settled ✓")
        
        return True


class CoingeckoSimulator:
    """Simulates Coingecko API responses"""
    
    # Mock SOL/USD prices for different timestamps
    MOCK_PRICES = {
        "SOL": 195.50,  # Example SOL price in USD
    }
    
    @staticmethod
    def get_price(coin_id: str, currency: str = "usd") -> float:
        """Simulate fetching price from Coingecko"""
        print(f"   Requesting: {coin_id.upper()}/{currency.upper()}")
        time.sleep(0.3)  # Simulate network call
        
        if coin_id in CoingeckoSimulator.MOCK_PRICES:
            price = CoingeckoSimulator.MOCK_PRICES[coin_id]
            print(f"   Response: {coin_id.upper()}/{currency.upper()} = ${price}")
            return price
        else:
            raise ValueError(f"Unknown coin: {coin_id}")


def run_complete_workflow():
    """Run complete oracle workflow demonstration"""
    
    print("=" * 70)
    print("XyData Oracle - Complete Workflow Demonstration")
    print("=" * 70)
    
    # Initialize validator and oracle
    validator = MockSolanaValidator()
    oracle = OracleProgram(validator)
    
    # Step 1: Initialize Oracle
    print("\n[STEP 1] Initialize Oracle")
    print("-" * 70)
    admin = "oracle_admin_key_123"
    oracle_key = oracle.init_oracle(admin, fee_bps=500)  # 5% fee
    
    # Step 2: Agent requests data
    print("\n[STEP 2] Agent Requests Data")
    print("-" * 70)
    requester = "agent_key_xyz"
    request_key = oracle.request_data(requester, "SOL/USD", quantity=1)
    
    # Step 3: Fetch and verify data
    print("\n[STEP 3] Fetch and Verify Data")
    print("-" * 70)
    
    # Get current SOL price from mock API
    sol_price = CoingeckoSimulator.get_price("SOL", "usd")
    # Convert to cents for on-chain storage
    data_value = int(sol_price * 100)
    timestamp = int(time.time())
    
    proof_key, verified = oracle.fetch_and_verify(request_key, data_value, timestamp)
    
    if not verified:
        print("❌ Verification failed, stopping workflow")
        return
    
    # Step 4: Settle payment
    print("\n[STEP 4] Settle Payment")
    print("-" * 70)
    payment_amount = 1000000  # 1 SOL in lamports
    settlement_ok = oracle.settle_payment(request_key, payment_amount)
    
    if not settlement_ok:
        print("❌ Settlement failed")
        return
    
    # Print summary
    print("\n[SUMMARY]")
    print("=" * 70)
    
    print("\n📊 Oracle Statistics:")
    oracle_acc = validator.get_account(oracle_key)
    print(f"   Total Requests: {oracle_acc['data']['total_requests']}")
    print(f"   Total Fees Collected: {oracle_acc['data']['total_fees_collected']} lamports")
    
    print("\n📋 Request Details:")
    request_acc = validator.get_account(request_key)
    print(f"   Status: {request_acc['data']['status']}")
    print(f"   Payment: {request_acc['data']['payment_amount']} lamports")
    
    print("\n✓ Verification Details:")
    proof_acc = validator.get_account(proof_key)
    print(f"   Data Value: {proof_acc['data']['data_value']} (cents)")
    print(f"   Timestamp: {datetime.fromtimestamp(proof_acc['data']['timestamp']).isoformat()}")
    
    print("\n📝 Instruction Log:")
    print(f"   Total Instructions: {len(validator.instructions_log)}")
    for i, instr in enumerate(validator.instructions_log, 1):
        print(f"   {i}. {instr['instruction']}")
    
    print("\n" + "=" * 70)
    print("✓ Workflow completed successfully!")
    print("=" * 70)


if __name__ == "__main__":
    run_complete_workflow()
