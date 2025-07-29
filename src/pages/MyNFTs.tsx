import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Image, Eye, Heart } from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'

const MyNFTs: React.FC = () => {
  const { myNFTs, loading } = useMarketplace()
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-dark-400">
          Connect your wallet to view your NFT collection.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My NFTs</h1>
          <p className="text-dark-400">
            Manage your NFT collection
          </p>
        </div>
        <Link to="/create-listing" className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>List NFT</span>
        </Link>
      </div>

      {myNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No NFTs Found
          </h3>
          <p className="text-dark-400 mb-4">
            You don't have any NFTs in your wallet yet.
          </p>
          <Link to="/marketplace" className="btn-primary">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myNFTs.map((nft, index) => (
            <motion.div
              key={nft.mint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="nft-card group cursor-pointer"
            >
              <Link to={`/nft/${nft.mint}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">
                    {nft.name}
                  </h3>
                  <p className="text-sm text-dark-400">
                    {nft.description?.substring(0, 60)}...
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-dark-400">
                      Owned by you
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-dark-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>1.2k</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>89</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyNFTs 