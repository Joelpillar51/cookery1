import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Eye, 
  Star, 
  Clock,
  User
} from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

const NFTDetail: React.FC = () => {
  const { mint } = useParams<{ mint: string }>()
  const navigate = useNavigate()
  const { listings, purchaseNFT, cancelListing, loading } = useMarketplace()
  const { connected, publicKey } = useWallet()
  
  const [listing, setListing] = useState<any>(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (mint && listings.length > 0) {
      const foundListing = listings.find(l => l.nft.mint === mint)
      if (foundListing) {
        setListing(foundListing)
      } else {
        // Handle direct NFT data (from Dashboard clicks)
        const mockNFT = {
          nft: {
            mint: mint,
            name: 'NFT Details',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
            description: 'A unique NFT from the collection.'
          },
          price: '1.5 SOL',
          seller: 'mock-seller-address',
          createdAt: new Date().toISOString()
        }
        setListing(mockNFT)
      }
    }
  }, [mint, listings])

  const handlePurchase = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!listing) return

    try {
      await purchaseNFT(listing.id)
      toast.success('NFT purchased successfully!')
      navigate('/my-nfts')
    } catch (error) {
      toast.error('Failed to purchase NFT. Please try again.')
    }
  }

  const handleCancelListing = async () => {
    if (!listing) return

    try {
      await cancelListing(listing.id)
      toast.success('Listing cancelled successfully!')
      navigate('/my-nfts')
    } catch (error) {
      toast.error('Failed to cancel listing. Please try again.')
    }
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Loading NFT details...</p>
        </div>
      </div>
    )
  }

  const isOwner = listing.seller === publicKey

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <img
              src={listing.nft.image}
              alt={listing.nft.name}
              className="w-full rounded-2xl shadow-lg"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-dark-800/80 text-dark-400 hover:bg-dark-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 bg-dark-800/80 rounded-full text-dark-400 hover:bg-dark-700 transition-colors duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Title and Stats */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {listing.nft.name}
            </h1>
            <p className="text-dark-400 mb-4">
              {listing.nft.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-dark-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>1.2k views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>4.8 rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-dark-400">Current Price</span>
              <span className="text-2xl font-bold text-purple-400">
                {listing.price} SOL
              </span>
            </div>
            
            {isOwner ? (
              <button
                onClick={handleCancelListing}
                disabled={loading}
                className="w-full btn-secondary py-3"
              >
                {loading ? 'Cancelling...' : 'Cancel Listing'}
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={loading || !connected}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : connected ? 'Buy Now' : 'Connect Wallet to Buy'}
              </button>
            )}
          </div>

          {/* Details */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-white">Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Contract Address</span>
                <span className="font-mono text-sm text-white">
                  {listing.nft.mint.slice(0, 8)}...{listing.nft.mint.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Token ID</span>
                <span className="font-mono text-sm text-white">
                  #{listing.nft.mint.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Token Standard</span>
                <span className="text-white">SPL Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Blockchain</span>
                <span className="text-white">Solana</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="card">
            <h3 className="font-semibold text-white mb-4">Seller</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">
                  {listing.seller.slice(0, 8)}...{listing.seller.slice(-8)}
                </p>
                <p className="text-sm text-dark-400">Verified Seller</p>
              </div>
            </div>
          </div>

          {/* Attributes */}
          {listing.nft.attributes && listing.nft.attributes.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-white mb-4">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {listing.nft.attributes.map((attr: any, index: number) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-3">
                    <p className="text-xs text-dark-400 uppercase tracking-wide">
                      {attr.trait_type}
                    </p>
                    <p className="font-medium text-white">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default NFTDetail 