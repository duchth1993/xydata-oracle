#!/bin/bash

# XyData Oracle Deployment Script
# This script helps deploy the oracle contract and run tests

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "================================"
echo "XyData Oracle Deployment Script"
echo "================================"
echo ""

# Check for required tools
check_requirements() {
    echo "Checking requirements..."
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is required but not installed"
        exit 1
    fi
    
    if ! command -v solana &> /dev/null; then
        echo "⚠️  Solana CLI not found. Some features may not work."
        echo "   Install from: https://docs.solana.com/cli/install-solana-cli-tools"
    fi
    
    if ! command -v anchor &> /dev/null; then
        echo "⚠️  Anchor not found. Required for contract deployment."
        echo "   Install from: https://www.anchor-lang.com/"
    fi
    
    echo "✓ Basic requirements met"
}

# Install Python dependencies
install_dependencies() {
    echo ""
    echo "Installing Python dependencies..."
    
    if [ ! -f "$SCRIPT_DIR/requirements.txt" ]; then
        echo "❌ requirements.txt not found"
        exit 1
    fi
    
    python3 -m pip install -q -r "$SCRIPT_DIR/requirements.txt"
    echo "✓ Dependencies installed"
}

# Run the test suite
run_tests() {
    echo ""
    echo "Running oracle test suite..."
    echo ""
    
    cd "$SCRIPT_DIR"
    python3 test_oracle.py
}

# Build the smart contract
build_contract() {
    echo ""
    echo "Building smart contract..."
    
    if [ ! -d "$PROJECT_ROOT/solana-program" ]; then
        echo "❌ solana-program directory not found"
        exit 1
    fi
    
    cd "$PROJECT_ROOT/solana-program"
    
    if command -v anchor &> /dev/null; then
        anchor build
        echo "✓ Smart contract built successfully"
    else
        echo "⚠️  Anchor not installed, skipping contract build"
        echo "   To build: cd solana-program && anchor build"
    fi
}

# Deploy contract
deploy_contract() {
    echo ""
    echo "Deploying contract..."
    echo ""
    
    if [ ! -d "$PROJECT_ROOT/solana-program" ]; then
        echo "❌ solana-program directory not found"
        exit 1
    fi
    
    cd "$PROJECT_ROOT/solana-program"
    
    if command -v anchor &> /dev/null; then
        echo "Ensure Solana localnet is running:"
        echo "  solana-test-validator"
        echo ""
        read -p "Press Enter when localnet is ready..."
        
        anchor deploy
        echo "✓ Contract deployed successfully"
    else
        echo "⚠️  Anchor not installed, cannot deploy"
        echo "   To deploy: cd solana-program && anchor deploy"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "1) Check requirements"
    echo "2) Install dependencies"
    echo "3) Run tests (requires no chain)"
    echo "4) Build smart contract"
    echo "5) Deploy contract (requires localnet)"
    echo "6) Full setup (all steps)"
    echo "7) Exit"
    echo ""
    read -p "Select option (1-7): " option
    
    case $option in
        1)
            check_requirements
            ;;
        2)
            install_dependencies
            ;;
        3)
            run_tests
            ;;
        4)
            build_contract
            ;;
        5)
            deploy_contract
            ;;
        6)
            check_requirements
            install_dependencies
            build_contract
            echo ""
            echo "Next steps:"
            echo "1. Start localnet: solana-test-validator"
            echo "2. Run: anchor deploy"
            echo "3. Run: python3 test_oracle.py"
            ;;
        7)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
    
    show_menu
}

# Run main
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        test)
            install_dependencies
            run_tests
            ;;
        build)
            build_contract
            ;;
        deploy)
            deploy_contract
            ;;
        setup)
            check_requirements
            install_dependencies
            ;;
        *)
            echo "Usage: $0 [test|build|deploy|setup]"
            echo ""
            echo "Commands:"
            echo "  test   - Run Python test suite"
            echo "  build  - Build smart contract"
            echo "  deploy - Deploy to localnet"
            echo "  setup  - Install dependencies"
            echo ""
            echo "Run with no arguments for interactive menu"
            exit 1
            ;;
    esac
fi
