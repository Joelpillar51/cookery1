import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Wallet, 
  Activity, 
  Star, 
  TrendingUp,
  Settings,
  LogOut,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../contexts/MarketplaceContext'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet()
  const { listings, myNFTs } = useMarketplace()

  const userStats = {
    totalNFTs: myNFTs.length,
    activeListings: listings.filter(l => l.seller === publicKey && l.status === 'active').length,
    totalSales: listings.filter(l => l.seller === publicKey && l.status === 'sold').length,
    totalVolume: listings
      .filter(l => l.seller === publicKey && l.status === 'sold')
      .reduce((sum, l) => sum + l.price, 0),
  }

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      toast.success('Address copied to clipboard!')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-dark-400">
          Connect your wallet to view your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-dark-400">
          Manage your account and view your activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="card text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              NFT Collector
            </h2>
            <p className="text-dark-400 mb-4">Active since 2024</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <span className="text-dark-400">Wallet Address</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
                >
                  <span className="font-mono text-sm">
                    {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                  </span>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats and Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats.totalNFTs}
              </div>
              <div className="text-sm text-dark-400">Total NFTs</div>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats.activeListings}
              </div>
              <div className="text-sm text-dark-400">Active Listings</div>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats.totalSales}
              </div>
              <div className="text-sm text-dark-400">Total Sales</div>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats.totalVolume.toFixed(2)}
              </div>
              <div className="text-sm text-dark-400">Volume (SOL)</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {listings
                .filter(l => l.seller === publicKey)
                .slice(0, 5)
                .map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {listing.status === 'active' ? 'Listed' : listing.status === 'sold' ? 'Sold' : 'Cancelled'}: {listing.nft.name}
                      </p>
                      <p className="text-sm text-dark-400">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {listing.price} SOL
                      </p>
                      <p className="text-xs text-dark-400 capitalize">
                        {listing.status}
                      </p>
                    </div>
                  </div>
                ))}
              
              {listings.filter(l => l.seller === publicKey).length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                  <p className="text-dark-400">No activity yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://solscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200"
              >
                <ExternalLink className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">View on Solscan</p>
                  <p className="text-sm text-dark-400">Blockchain explorer</p>
                </div>
              </a>
              
              <button className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200">
                <Settings className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Settings</p>
                  <p className="text-sm text-dark-400">Account preferences</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile 