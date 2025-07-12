// Cardano Wallet Integration for DEGE
import { Lucid, Blockfrost } from 'https://esm.sh/lucid-cardano@0.10.7';

class DegeWallet {
    constructor() {
        this.lucid = null;
        this.walletAPI = null;
        this.isConnected = false;
        this.address = null;
        this.balance = null;
        this.supportedWallets = ['nami', 'eternl', 'flint', 'typhon', 'vespr', 'yoroi'];
        this.init();
    }

    async init() {
        try {
            // Initialize Lucid with Blockfrost (you'll need to replace with your API key)
            this.lucid = await Lucid.new(
                new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'YOUR_BLOCKFROST_API_KEY'),
                'Mainnet'
            );
            console.log('🚀 DEGE Wallet System Initialized');
        } catch (error) {
            console.error('Failed to initialize Lucid:', error);
        }
    }

    // Get available wallets
    getAvailableWallets() {
        const available = [];
        this.supportedWallets.forEach(wallet => {
            if (window.cardano && window.cardano[wallet]) {
                available.push({
                    name: wallet,
                    displayName: this.getWalletDisplayName(wallet),
                    icon: this.getWalletIcon(wallet)
                });
            }
        });
        return available;
    }

    getWalletDisplayName(wallet) {
        const names = {
            'nami': 'Nami',
            'eternl': 'Eternl',
            'flint': 'Flint',
            'typhon': 'Typhon',
            'vespr': 'Vespr',
            'yoroi': 'Yoroi'
        };
        return names[wallet] || wallet.charAt(0).toUpperCase() + wallet.slice(1);
    }

    getWalletIcon(wallet) {
        // You can add custom icons here
        return `🦅`; // Default eagle icon for DEGE theme
    }

    // Connect to wallet
    async connectWallet(walletName) {
        try {
            if (!window.cardano || !window.cardano[walletName]) {
                throw new Error(`${walletName} wallet not found. Please install the wallet extension.`);
            }

            // Enable the wallet
            this.walletAPI = await window.cardano[walletName].enable();
            
            // Set wallet API in Lucid
            this.lucid.selectWallet(this.walletAPI);

            // Get wallet address
            this.address = await this.lucid.wallet.address();
            
            // Get wallet balance
            await this.updateBalance();

            this.isConnected = true;
            
            console.log(`🎉 Successfully connected to ${walletName}!`);
            this.updateUI();
            
            return {
                success: true,
                address: this.address,
                balance: this.balance
            };

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update wallet balance
    async updateBalance() {
        try {
            if (!this.isConnected) return;

            const utxos = await this.lucid.wallet.getUtxos();
            let totalADA = 0;
            
            utxos.forEach(utxo => {
                totalADA += Number(utxo.assets.lovelace || 0);
            });

            this.balance = {
                ada: totalADA / 1000000, // Convert lovelace to ADA
                lovelace: totalADA
            };

            return this.balance;
        } catch (error) {
            console.error('Failed to update balance:', error);
            return null;
        }
    }

    // Disconnect wallet
    async disconnectWallet() {
        this.walletAPI = null;
        this.isConnected = false;
        this.address = null;
        this.balance = null;
        this.updateUI();
        console.log('👋 Wallet disconnected');
    }

    // Update UI elements
    updateUI() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const walletInfo = document.getElementById('wallet-info');
        const walletAddress = document.getElementById('wallet-address');
        const walletBalance = document.getElementById('wallet-balance');

        if (this.isConnected) {
            if (connectBtn) connectBtn.textContent = 'Disconnect Wallet';
            if (walletInfo) walletInfo.style.display = 'block';
            if (walletAddress) walletAddress.textContent = this.formatAddress(this.address);
            if (walletBalance) walletBalance.textContent = `${this.balance?.ada?.toFixed(2) || '0.00'} ADA`;
        } else {
            if (connectBtn) connectBtn.textContent = 'Connect Wallet';
            if (walletInfo) walletInfo.style.display = 'none';
        }
    }

    // Format address for display
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }

    // Create DEGE token transaction (example)
    async sendDegeTokens(recipientAddress, amount) {
        try {
            if (!this.isConnected) {
                throw new Error('Please connect your wallet first');
            }

            // This is a placeholder - you'd need to implement actual DEGE token logic
            const tx = await this.lucid
                .newTx()
                .payToAddress(recipientAddress, { lovelace: BigInt(amount * 1000000) })
                .complete();

            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();

            return {
                success: true,
                txHash: txHash
            };

        } catch (error) {
            console.error('Transaction failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Initialize wallet system
const degeWallet = new DegeWallet();

// Global functions for UI interaction
window.degeWallet = degeWallet;
window.connectWallet = (walletName) => degeWallet.connectWallet(walletName);
window.disconnectWallet = () => degeWallet.disconnectWallet();
window.updateBalance = () => degeWallet.updateBalance();

// Export for module usage
export default degeWallet; 