import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Search, 
  Grid3X3,
  List,
  Eye,
  ShoppingBag,
  Clock,
  Trash2,
  DollarSign
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { Link } from 'react-router-dom'

interface FavoriteNFT {
  id: number
  name: string
  image: string
  collection: string
  price: number
  floorPrice: number
  lastSale: number
  rarity: string
  attributes: string[]
  likedAt: Date
  isListed: boolean
  timeLeft?: string
}

const Favorites: React.FC = () => {
  const { connected } = useWallet()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  // Mock favorites data
  const favoriteNFTs: FavoriteNFT[] = [
    {
      id: 1,
      name: 'Cyber Falcon',
      image: '/cyber-falcon.png',
      collection: 'Cyber Falcons',
      price: 145.0,
      floorPrice: 140.0,
      lastSale: 142.0,
      rarity: 'Legendary',
      attributes: ['Cyber', 'Falcon', 'Legendary', 'Chrome'],
      likedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '2h 15m'
    },
    {
      id: 2,
      name: 'Digital Art Masterpiece',
      image: '/Digital-Art.png',
      collection: 'Digital Arts',
      price: 1.8,
      floorPrice: 1.6,
      lastSale: 1.7,
      rarity: 'Epic',
      attributes: ['Digital', 'Art', 'Epic', 'Abstract'],
      likedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isListed: false
    },
    {
      id: 3,
      name: 'Pixel Warrior',
      image: '/pixel warrior.png',
      collection: 'Pixel Warriors',
      price: 3.2,
      floorPrice: 3.0,
      lastSale: 3.1,
      rarity: 'Rare',
      attributes: ['Pixel', 'Warrior', 'Rare', 'Combat'],
      likedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '1d 3h'
    },
    {
      id: 4,
      name: 'Cyberpunk City',
      image: '/AI-Cyberpunk-City.png',
      collection: 'Cyberpunk City',
      price: 4.1,
      floorPrice: 3.8,
      lastSale: 4.0,
      rarity: 'Legendary',
      attributes: ['Cyberpunk', 'City', 'Legendary', 'Neon'],
      likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '12h 45m'
    },
    {
      id: 5,
      name: 'Ocean Explorer',
      image: '/ocean-explorer.png',
      collection: 'Ocean Explorers',
      price: 2.9,
      floorPrice: 2.7,
      lastSale: 2.8,
      rarity: 'Epic',
      attributes: ['Ocean', 'Explorer', 'Epic', 'Nature'],
      likedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isListed: false
    },
    {
      id: 6,
      name: 'Abstract Mind',
      image: '/Abstract-Minds.png',
      collection: 'Abstract Minds',
      price: 1.5,
      floorPrice: 1.3,
      lastSale: 1.4,
      rarity: 'Rare',
      attributes: ['Abstract', 'Mind', 'Rare', 'Psychedelic'],
      likedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '6h 30m'
    },
    {
      id: 7,
      name: 'Mad Lad',
      image: '/madlad.png',
      collection: 'Mad Lads',
      price: 4.5,
      floorPrice: 4.2,
      lastSale: 4.3,
      rarity: 'Legendary',
      attributes: ['Mad', 'Lad', 'Legendary', 'Rebellious'],
      likedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '1d 8h'
    }
  ]

  const filteredFavorites = favoriteNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.likedAt.getTime() - a.likedAt.getTime()
      case 'price-high':
        return b.price - a.price
      case 'price-low':
        return a.price - b.price
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const removeFavorite = (id: number) => {
    // In a real app, this would update the backend
    console.log('Removing favorite:', id)
  }

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-dark-400">
          Connect your wallet to view your favorites.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Favorites</h1>
          <p className="text-dark-400">Your liked NFTs and collections</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-dark-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="recent">Recently Added</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Total Favorites</p>
              <p className="text-2xl font-bold text-white">{favoriteNFTs.length}</p>
            </div>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Listed for Sale</p>
              <p className="text-2xl font-bold text-white">
                {favoriteNFTs.filter(nft => nft.isListed).length}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {favoriteNFTs.reduce((sum, nft) => sum + nft.price, 0).toFixed(1)} SOL
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Favorites Grid/List */}
      {sortedFavorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-dark-400 mb-4">
            {searchTerm ? 'No favorites match your search.' : 'Start exploring and like some NFTs!'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {sortedFavorites.map((nft) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={viewMode === 'grid' ? 'nft-card group' : 'bg-dark-800 rounded-lg p-4 flex items-center space-x-4'}
            >
              {/* NFT Image */}
              <div className={viewMode === 'grid' ? 'relative' : 'relative w-20 h-20 flex-shrink-0'}>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className={`${viewMode === 'grid' ? 'w-full h-48' : 'w-20 h-20'} object-cover rounded-lg`}
                />
                {nft.isListed && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Listed
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* NFT Info */}
              <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm truncate">{nft.name}</h3>
                    <p className="text-dark-400 text-xs">{nft.collection}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-indigo-400 text-xs font-medium">{nft.rarity}</span>
                      {nft.isListed && nft.timeLeft && (
                        <div className="flex items-center text-xs text-dark-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {nft.timeLeft}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="text-right">
                      <p className="text-white font-semibold">{nft.price} SOL</p>
                      <p className="text-dark-400 text-xs">
                        {nft.likedAt.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {viewMode === 'grid' && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-white font-semibold">{nft.price} SOL</p>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-dark-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeFavorite(nft.id)}
                        className="p-1 text-dark-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* List View Actions */}
              {viewMode === 'list' && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/nft/${nft.id}`}
                    className="p-2 text-dark-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => removeFavorite(nft.id)}
                    className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites 