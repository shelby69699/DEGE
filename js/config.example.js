// DEGE Wallet Configuration
// Copy this file to config.js and update with your settings

export const WALLET_CONFIG = {
    // Get your free API key from https://blockfrost.io/
    BLOCKFROST_API_KEY: 'YOUR_BLOCKFROST_API_KEY_HERE',
    
    // Network (use 'Mainnet' for production, 'Testnet' for testing)
    NETWORK: 'Mainnet',
    
    // Blockfrost URL (change if using testnet)
    BLOCKFROST_URL: 'https://cardano-mainnet.blockfrost.io/api/v0',
    
    // DEGE Token Information (update when token is deployed)
    DEGE_TOKEN: {
        // Policy ID of your DEGE token (to be added when token is minted)
        policyId: '',
        // Token name in hex (to be added when token is minted)
        tokenName: '',
        // Decimals for display
        decimals: 6
    },
    
    // Wallet Settings
    WALLET_SETTINGS: {
        // Auto-refresh balance interval (in seconds)
        balanceRefreshInterval: 30,
        // Show detailed transaction info
        showTransactionDetails: true,
        // Enable notifications
        enableNotifications: true
    }
};

// Example usage:
// 1. Copy this file to config.js
// 2. Update BLOCKFROST_API_KEY with your actual key
// 3. Import in wallet.js: import { WALLET_CONFIG } from './config.js'; 