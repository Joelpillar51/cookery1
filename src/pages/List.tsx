import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image, DollarSign, AlertCircle, Search, Plus, Clock, Tag } from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

interface NFTMetadata {
  mint: string
  name: string
  symbol: string
  uri: string
  image: string
  description?: string
  attributes?: Array<{ trait_type: string; value: string }>
}

const List: React.FC = () => {
  const navigate = useNavigate()
  const { createListing, loading, isInitialized } = useMarketplace()
  const { connected, publicKey } = useWallet()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [userNFTs, setUserNFTs] = useState<NFTMetadata[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null)
  const [price, setPrice] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [listingType, setListingType] = useState<'fixed' | 'auction'>('fixed')
  const [duration, setDuration] = useState('7') // days

  // Fetch user's NFTs from wallet
  const fetchUserNFTs = async () => {
    if (!connected || !publicKey) return

    setIsSearching(true)
    try {
      // Mock data for demonstration
      // In a real app, this would fetch from the blockchain
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      const mockNFTs: NFTMetadata[] = [
        {
          mint: 'mock-mint-1',
          name: 'Cyber Falcon',
          symbol: 'CYBER',
          uri: 'https://example.com/metadata/1',
          image: '/cyber-falcon.png',
          description: 'A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm. This NFT represents the pinnacle of cybernetic evolution.',
          attributes: [
            { trait_type: 'Species', value: 'Cyber Falcon' },
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Edition', value: '1/100' },
            { trait_type: 'Power Level', value: '100' },
          ],
        },
        {
          mint: 'mock-mint-2',
          name: 'Digital Art Masterpiece',
          symbol: 'DIGITAL',
          uri: 'https://example.com/metadata/2',
          image: '/Digital-Art.png',
          description: 'A stunning digital art piece created by a renowned artist. This masterpiece showcases the fusion of traditional art principles with modern digital techniques.',
          attributes: [
            { trait_type: 'Style', value: 'Abstract' },
            { trait_type: 'Edition', value: '1/100' },
            { trait_type: 'Artist', value: 'CryptoArtist' },
            { trait_type: 'Year', value: '2024' },
          ],
        },
        {
          mint: 'mock-mint-3',
          name: 'Pixel Warrior',
          symbol: 'PIXEL',
          uri: 'https://example.com/metadata/3',
          image: '/pixel warrior.png',
          description: 'A fierce pixel warrior ready for battle. This warrior has been through countless battles and carries the scars of victory.',
          attributes: [
            { trait_type: 'Weapon', value: 'Laser Sword' },
            { trait_type: 'Armor', value: 'Diamond' },
            { trait_type: 'Level', value: '42' },
            { trait_type: 'Class', value: 'Warrior' },
          ],
        },
        {
          mint: 'mock-mint-4',
          name: 'Cyberpunk City',
          symbol: 'NEON',
          uri: 'https://example.com/metadata/4',
          image: '/AI-Cyberpunk-City.png',
          description: 'A cyberpunk-inspired cityscape with neon lights and futuristic architecture. This NFT captures the essence of a digital metropolis.',
          attributes: [
            { trait_type: 'Theme', value: 'Cyberpunk' },
            { trait_type: 'Time', value: 'Night' },
            { trait_type: 'Weather', value: 'Rain' },
            { trait_type: 'Rarity', value: 'Epic' },
          ],
        },
        {
          mint: 'mock-mint-5',
          name: 'Golden Falcon',
          symbol: 'FALCON',
          uri: 'https://example.com/metadata/5',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          description: 'A majestic golden falcon soaring through the digital sky. This rare creature represents freedom and power in the metaverse.',
          attributes: [
            { trait_type: 'Species', value: 'Golden Falcon' },
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Speed', value: 'Max' },
            { trait_type: 'Edition', value: '1/500' },
          ],
        }
      ]

      setUserNFTs(mockNFTs)
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      toast.error('Failed to fetch your NFTs')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserNFTs()
    }
  }, [connected, publicKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isInitialized) {
      toast.error('Marketplace is not initialized')
      return
    }

    if (!selectedNFT) {
      toast.error('Please select an NFT to list')
      return
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    try {
      const nft = {
        mint: selectedNFT.mint,
        name: selectedNFT.name,
        symbol: selectedNFT.symbol,
        uri: selectedNFT.uri,
        seller: publicKey?.toString() || '',
        price: 0,
        image: selectedNFT.image,
        description: selectedNFT.description,
        attributes: selectedNFT.attributes,
      }

      await createListing(nft, parseFloat(price))
      toast.success(`NFT listed successfully as ${listingType === 'auction' ? 'auction' : 'fixed price'}!`)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing. Please try again.')
    }
  }

  const filteredNFTs = userNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-dark-400">
          Connect your wallet to list NFTs.
        </p>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Marketplace Not Initialized
        </h3>
        <p className="text-dark-400">
          The marketplace needs to be initialized before you can list NFTs.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-800 rounded-xl p-8 border border-dark-700"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">List NFT</h1>
            <p className="text-dark-400">List your NFT for sale on the marketplace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* NFT Selection */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Select NFT</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                  <p className="text-dark-400">Loading your NFTs...</p>
                </div>
              ) : filteredNFTs.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Image className="w-12 h-12 text-dark-400 mx-auto mb-2" />
                  <p className="text-dark-400">
                    {searchTerm ? 'No NFTs match your search' : 'No NFTs found in your wallet'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-indigo-400 hover:text-indigo-300 text-sm mt-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredNFTs.map((nft) => (
                  <motion.div
                    key={nft.mint}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      selectedNFT?.mint === nft.mint
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500 hover:bg-dark-600'
                    }`}
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <div className="relative">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=NFT'
                        }}
                      />
                      {selectedNFT?.mint === nft.mint && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-white text-sm truncate">{nft.name}</h3>
                      <p className="text-dark-400 text-xs">{nft.symbol}</p>
                      {nft.attributes && nft.attributes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {nft.attributes.slice(0, 2).map((attr, index) => (
                            <span
                              key={index}
                              className="text-xs bg-dark-800 text-dark-300 px-1 py-0.5 rounded"
                            >
                              {attr.trait_type}: {attr.value}
                            </span>
                          ))}
                          {nft.attributes.length > 2 && (
                            <span className="text-xs text-dark-400">+{nft.attributes.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Selected NFT Details */}
          {selectedNFT && (
            <div className="bg-dark-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Selected NFT</h3>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* NFT Image and Basic Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-24 h-24 object-cover rounded-lg border border-dark-600"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/96x96?text=NFT'
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{selectedNFT.name}</h4>
                    <p className="text-indigo-400 text-sm font-medium">{selectedNFT.symbol}</p>
                    {selectedNFT.description && (
                      <p className="text-dark-300 text-sm mt-2 leading-relaxed">{selectedNFT.description}</p>
                    )}
                  </div>
                </div>
                
                {/* NFT Attributes */}
                {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                  <div className="lg:w-1/3">
                    <h5 className="text-sm font-medium text-white mb-3">Attributes</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.attributes.map((attr, index) => (
                        <div key={index} className="bg-dark-800 rounded-lg p-2">
                          <div className="text-xs text-dark-400 font-medium">{attr.trait_type}</div>
                          <div className="text-sm text-white font-semibold">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Listing Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setListingType('fixed')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  listingType === 'fixed'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Fixed Price</div>
                    <div className="text-sm text-dark-400">Set a specific price</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setListingType('auction')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  listingType === 'auction'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Auction</div>
                    <div className="text-sm text-dark-400">Let buyers bid</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {listingType === 'auction' ? 'Starting Price' : 'Listing Price'} (SOL)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Auction Duration (only for auctions) */}
          {listingType === 'auction' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Auction Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedNFT || !price || loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dark-800"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Listing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>List NFT</span>
              </div>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default List 