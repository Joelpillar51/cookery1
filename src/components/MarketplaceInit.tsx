import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, DollarSign, Store } from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'

const MarketplaceInit: React.FC = () => {
  const [name, setName] = useState('Cookery NFT Marketplace')
  const [feeBps, setFeeBps] = useState(250) // 2.5%
  const [isInitializing, setIsInitializing] = useState(false)
  const { initializeMarketplace } = useMarketplace()
  const { connected } = useWallet()

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) return

    setIsInitializing(true)
    try {
      await initializeMarketplace(name, feeBps)
    } catch (error) {
      console.error('Failed to initialize marketplace:', error)
    } finally {
      setIsInitializing(false)
    }
  }

  const feePercentage = (feeBps / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Initialize Marketplace
            </h1>
            <p className="text-dark-400">
              Set up your NFT marketplace with custom name and fees
            </p>
          </div>

          <form onSubmit={handleInitialize} className="space-y-6">
            {/* Marketplace Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Marketplace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter marketplace name"
                maxLength={32}
                required
              />
            </div>

            {/* Fee Setting */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Platform Fee ({feePercentage}%)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={feeBps}
                  onChange={(e) => setFeeBps(Number(e.target.value))}
                  className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-dark-400 mt-1">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-sm text-dark-300">
                <DollarSign className="w-4 h-4" />
                <span>Fee: {feePercentage}% per transaction</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-400">{feePercentage}%</div>
                <div className="text-xs text-dark-400">Platform Fee</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{100 - Number(feePercentage)}%</div>
                <div className="text-xs text-dark-400">Seller Receives</div>
              </div>
            </div>

            {/* Initialize Button */}
            <button
              type="submit"
              disabled={!connected || isInitializing}
              className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dark-800"
            >
              {isInitializing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Initializing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Initialize Marketplace</span>
                </div>
              )}
            </button>

            {!connected && (
              <div className="text-center text-red-400 text-sm">
                Please connect your wallet to continue
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-dark-700 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">What happens next?</h3>
            <ul className="text-xs text-dark-400 space-y-1">
              <li>• Marketplace account will be created on Solana</li>
              <li>• Treasury account will be set up for fee collection</li>
              <li>• You'll be set as the marketplace authority</li>
              <li>• Users can start listing and trading NFTs</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MarketplaceInit 