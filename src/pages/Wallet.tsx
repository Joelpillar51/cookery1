import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Download, 
  Upload,
  Send,
  ArrowDown,
  History,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Coins,
  Shield
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

import toast from 'react-hot-toast'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const WalletPage: React.FC = () => {
  console.log('WalletPage component rendered')
  const { connected, publicKey, publicKeyObject, disconnect } = useWallet()


  // States
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [transactions, setTransactions] = useState<any[]>([])
  const [nfts, setNfts] = useState<any[]>([])
  const [tokens, setTokens] = useState<any[]>([])

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      type: 'send',
      amount: 0.5,
      recipient: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      timestamp: Date.now() - 3600000,
      status: 'confirmed',
      fee: 0.000005
    },
    {
      id: 2,
      type: 'receive',
      amount: 2.0,
      sender: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      timestamp: Date.now() - 7200000,
      status: 'confirmed',
      fee: 0
    },
    {
      id: 3,
      type: 'nft_purchase',
      amount: 1.5,
      nftName: 'Cool NFT #123',
      timestamp: Date.now() - 86400000,
      status: 'confirmed',
      fee: 0.000005
    },
    {
      id: 4,
      type: 'nft_sale',
      amount: 3.2,
      nftName: 'Rare NFT #456',
      timestamp: Date.now() - 172800000,
      status: 'confirmed',
      fee: 0.000005
    }
  ]

  // Mock NFT data
  const mockNFTs = [
    {
      mint: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      name: 'Cool NFT #123',
      image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=NFT+1',
      collection: 'Cool Collection',
      floorPrice: 1.2,
      lastSale: 1.5
    },
    {
      mint: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      name: 'Rare NFT #456',
      image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=NFT+2',
      collection: 'Rare Collection',
      floorPrice: 2.8,
      lastSale: 3.2
    }
  ]

  // Mock token data
  const mockTokens = [
    {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 150.50,
      price: 1.00,
      value: 150.50
    },
    {
      mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      symbol: 'USDT',
      name: 'Tether USD',
      balance: 75.25,
      price: 1.00,
      value: 75.25
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Wallet },
    { id: 'transactions', name: 'Transactions', icon: History },
    { id: 'nfts', name: 'NFTs', icon: Coins },
    { id: 'tokens', name: 'Tokens', icon: DollarSign }
  ]

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!publicKeyObject) return

    try {
      const connection = new (await import('@solana/web3.js')).Connection(
        'https://api.devnet.solana.com'
      )
      const balance = await connection.getBalance(publicKeyObject)
      setWalletBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      setWalletBalance(0)
    }
  }

  // Copy wallet address
  const copyWalletAddress = async () => {
    if (!publicKey) {
      toast.error('No wallet connected')
      return
    }
    
    try {
      await navigator.clipboard.writeText(publicKey)
      toast.success('Wallet address copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy wallet address')
    }
  }

  // View on Solana Explorer
  const viewOnExplorer = () => {
    if (!publicKey) return
    window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank')
  }

  // Export private key (mock)
  const exportPrivateKey = () => {
    toast.error('Private key export not available in demo')
  }

  // Import wallet (mock)
  const importWallet = () => {
    toast.error('Wallet import not available in demo')
  }

  // Send SOL (mock)
  const sendSOL = () => {
    toast.error('Send functionality not available in demo')
  }

  // Receive SOL
  const receiveSOL = () => {
    if (!publicKey) {
      toast.error('No wallet connected')
      return
    }
    copyWalletAddress()
  }

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true)
    try {
      await fetchWalletBalance()
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Wallet data refreshed!')
    } catch (error) {
      toast.error('Failed to refresh wallet data')
    } finally {
      setIsLoading(false)
    }
  }

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <TrendingDown className="w-5 h-5 text-red-400" />
      case 'receive':
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'nft_purchase':
        return <Download className="w-5 h-5 text-blue-400" />
      case 'nft_sale':
        return <Upload className="w-5 h-5 text-purple-400" />
      default:
        return <History className="w-5 h-5 text-gray-400" />
    }
  }

  // Get transaction status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  // Load initial data
  useEffect(() => {
    if (connected) {
      fetchWalletBalance()
      setTransactions(mockTransactions)
      setNfts(mockNFTs)
      setTokens(mockTokens)
    }
  }, [connected, publicKey])

  // Auto-refresh balance
  useEffect(() => {
    if (!connected) return

    const interval = setInterval(fetchWalletBalance, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [connected, publicKeyObject])

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Balance</h3>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="text-3xl font-bold mb-2">
          {walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : 'Loading...'}
        </div>
        
        <div className="flex items-center space-x-4 text-sm opacity-90">
          <span>≈ ${walletBalance ? (walletBalance * 100).toFixed(2) : '0.00'} USD</span>
          <span>•</span>
          <span>Devnet</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={sendSOL}
          className="bg-dark-700/50 hover:bg-dark-600/50 rounded-xl p-4 text-center transition-colors"
        >
          <Send className="w-6 h-6 text-primary-400 mx-auto mb-2" />
          <div className="text-white font-medium">Send</div>
        </button>
        
        <button
          onClick={receiveSOL}
          className="bg-dark-700/50 hover:bg-dark-600/50 rounded-xl p-4 text-center transition-colors"
        >
          <ArrowDown className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-white font-medium">Receive</div>
        </button>
        
        <button
          onClick={importWallet}
          className="bg-dark-700/50 hover:bg-dark-600/50 rounded-xl p-4 text-center transition-colors"
        >
          <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-medium">Import</div>
        </button>
        
        <button
          onClick={exportPrivateKey}
          className="bg-dark-700/50 hover:bg-dark-600/50 rounded-xl p-4 text-center transition-colors"
        >
          <Download className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-white font-medium">Export</div>
        </button>
      </div>

      {/* Wallet Info */}
      <div className="bg-dark-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Wallet Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-dark-400">Address</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono text-sm">
                {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : 'Not connected'}
              </span>
              <button
                onClick={copyWalletAddress}
                className="p-1 text-dark-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-dark-400">Network</span>
            <span className="text-white">Devnet</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-dark-400">Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={viewOnExplorer}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Explorer</span>
          </button>
          
          <button
            onClick={disconnect}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-dark-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(tx.type)}
                <div>
                  <div className="text-white font-medium capitalize">
                    {tx.type.replace('_', ' ')}
                  </div>
                  <div className="text-dark-400 text-sm">
                    {tx.type === 'send' && `To: ${tx.recipient.slice(0, 8)}...${tx.recipient.slice(-8)}`}
                    {tx.type === 'receive' && `From: ${tx.sender.slice(0, 8)}...${tx.sender.slice(-8)}`}
                    {tx.type === 'nft_purchase' && `Purchased: ${tx.nftName}`}
                    {tx.type === 'nft_sale' && `Sold: ${tx.nftName}`}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  tx.type === 'send' || tx.type === 'nft_purchase' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {tx.type === 'send' || tx.type === 'nft_purchase' ? '-' : '+'}{tx.amount} SOL
                </div>
                <div className="text-dark-400 text-sm">
                  {formatTimestamp(tx.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-600/30">
              <div className="flex items-center space-x-2">
                {getStatusIcon(tx.status)}
                <span className="text-dark-400 text-sm capitalize">{tx.status}</span>
              </div>
              <div className="text-dark-400 text-sm">
                Fee: {tx.fee} SOL
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNFTs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">NFT Collection</h3>
        <span className="text-dark-400">{nfts.length} NFTs</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <div key={index} className="bg-dark-700/30 rounded-xl p-4">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <div className="space-y-2">
              <h4 className="text-white font-medium">{nft.name}</h4>
              <p className="text-dark-400 text-sm">{nft.collection}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Floor:</span>
                <span className="text-white">{nft.floorPrice} SOL</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Last Sale:</span>
                <span className="text-green-400">{nft.lastSale} SOL</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTokens = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Token Balances</h3>
        <span className="text-dark-400">{tokens.length} tokens</span>
      </div>

      <div className="space-y-3">
        {tokens.map((token, index) => (
          <div key={index} className="bg-dark-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{token.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{token.symbol}</div>
                  <div className="text-dark-400 text-sm">{token.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">{token.balance.toFixed(2)} {token.symbol}</div>
                <div className="text-dark-400 text-sm">≈ ${token.value.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'transactions':
        return renderTransactions()
      case 'nfts':
        return renderNFTs()
      case 'tokens':
        return renderTokens()
      default:
        return renderOverview()
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-dark-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-dark-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
            <p className="text-dark-400 mb-6">Connect your wallet to view wallet details and manage your assets.</p>
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go to Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-dark-400">Manage your wallet, view transactions, and track your assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/30">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPage 