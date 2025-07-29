import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, DollarSign, Save, AlertCircle } from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'

const MarketplaceSettings: React.FC = () => {
  const { marketplaceData, updateMarketplaceFee } = useMarketplace()
  const { connected, publicKey } = useWallet()
  const [newFeeBps, setNewFeeBps] = useState(marketplaceData?.feeBps || 250)
  const [isUpdating, setIsUpdating] = useState(false)

  const isAuthority = marketplaceData?.authority.toString() === publicKey?.toString()
  const currentFeePercentage = ((marketplaceData?.feeBps || 0) / 100).toFixed(2)
  const newFeePercentage = (newFeeBps / 100).toFixed(2)

  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !isAuthority) return

    setIsUpdating(true)
    try {
      await updateMarketplaceFee(newFeeBps)
    } catch (error) {
      console.error('Failed to update fee:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!marketplaceData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Marketplace Not Found
        </h3>
        <p className="text-dark-400">
          The marketplace data could not be loaded.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-800 rounded-xl p-8 border border-dark-700"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Marketplace Settings</h1>
            <p className="text-dark-400">{marketplaceData.name}</p>
          </div>
        </div>

        {/* Current Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="text-sm text-dark-400 mb-1">Current Fee</div>
            <div className="text-2xl font-bold text-indigo-400">{currentFeePercentage}%</div>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="text-sm text-dark-400 mb-1">Authority</div>
            <div className="text-sm text-white font-mono">
              {marketplaceData.authority.toString().slice(0, 8)}...
            </div>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="text-sm text-dark-400 mb-1">Treasury</div>
            <div className="text-sm text-white font-mono">
              {marketplaceData.treasury.toString().slice(0, 8)}...
            </div>
          </div>
        </div>

        {/* Fee Update Form */}
        {isAuthority ? (
          <form onSubmit={handleUpdateFee} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Update Platform Fee
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={newFeeBps}
                  onChange={(e) => setNewFeeBps(Number(e.target.value))}
                  className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-dark-400 mt-1">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-sm text-dark-300">
                <DollarSign className="w-4 h-4" />
                <span>New Fee: {newFeePercentage}% per transaction</span>
              </div>
            </div>

            {/* Fee Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-red-400">{currentFeePercentage}%</div>
                <div className="text-xs text-dark-400">Current Fee</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-400">{newFeePercentage}%</div>
                <div className="text-xs text-dark-400">New Fee</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!connected || isUpdating || newFeeBps === marketplaceData.feeBps}
              className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dark-800"
            >
              {isUpdating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Update Fee</span>
                </div>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Not Authorized</span>
            </div>
            <p className="text-yellow-300 text-sm mt-2">
              Only the marketplace authority can update fees. Your wallet is not the authority.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 bg-dark-700 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">About Platform Fees</h3>
          <ul className="text-xs text-dark-400 space-y-1">
            <li>• Fees are charged as a percentage of each transaction</li>
            <li>• Fees are sent to the marketplace treasury</li>
            <li>• Only the marketplace authority can change fees</li>
            <li>• Fee changes take effect immediately</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default MarketplaceSettings 