import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Clock,
  TrendingUp,
  ChevronRight,
  Info,
  Play
} from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'

const Home: React.FC = () => {
  const { listings } = useMarketplace()
  const { connected } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    if (connected) {
      navigate('/dashboard')
    }
  }, [connected, navigate])

  const featuredNFTs = listings.slice(0, 6)

  // Mock NFT drops data
  const nftDrops = [
    {
      id: 1,
      name: "AstroVerse",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop&crop=center",
      price: "0.03 ETH",
      items: "5.6K",
      minted: "16%",
      status: "Live",
      timeLeft: "01d 03h 34m",
      chain: "ethereum",
      badge: "green"
    },
    {
      id: 2,
      name: "Art for the Culture",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center",
      price: "FREE",
      items: "∞",
      minted: "279",
      status: "Live",
      timeLeft: "05d 05h 34m",
      chain: "ethereum",
      badge: "open-edition"
    },
    {
      id: 3,
      name: "Cura Legacy",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center",
      price: "0.00019 BTC",
      items: "3.3K",
      minted: "25%",
      status: "Live",
      timeLeft: "Aug 6",
      chain: "bitcoin",
      badge: "bitcoin"
    },
    {
      id: 4,
      name: "Digital insects by Souls.club",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
      price: "0.027 ETH",
      items: "TBA",
      minted: "0%",
      status: "starts",
      timeLeft: "04d 17h 34m",
      chain: "ethereum",
      badge: "green"
    }
  ]

  const chainFilters = [
    { name: "All Chains", active: true },
    { name: "Solana", icon: "★" },
    { name: "Bitcoin", icon: "₿" },
    { name: "Ethereum", icon: "◆" },
    { name: "Polygon", icon: "⬡" },
    { name: "Arbitrum", icon: "◈" }
  ]

  const biggestMovers = [
    {
      name: "Bored Ape Yacht Club",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
      price: "$184.26",
      volume: "$118,087",
      change: "+12.5%"
    },
    {
      name: "CryptoPunks",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop&crop=center",
      price: "$3,632.18",
      volume: "$89,234",
      change: "+8.2%"
    },
    {
      name: "Doodles",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center",
      price: "$2.45",
      volume: "$45,123",
      change: "+15.7%"
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* NFT Drops Calendar Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            NFT Drops Calendar
          </h2>
          
          {/* Chain Filters */}
          <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
            {chainFilters.map((chain) => (
              <motion.button
                key={chain.name}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  chain.active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700 hover:shadow-md'
                }`}
              >
                {chain.icon && <span className="transition-transform duration-200 group-hover:scale-110">{chain.icon}</span>}
                <span>{chain.name}</span>
              </motion.button>
            ))}
          </div>

          {/* NFT Drops Cards */}
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {nftDrops.map((drop) => (
                <motion.div
                  key={drop.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="flex-shrink-0 w-80 bg-dark-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
                >
                  {/* Multicolor stroke effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 via-slate-400 via-indigo-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                  <div className="absolute inset-0.5 rounded-xl bg-dark-800"></div>
                  <div className="relative">
                    <img
                      src={drop.image}
                      alt={drop.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      {drop.badge === "open-edition" ? (
                        <div className="bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                          OPEN EDITION
                        </div>
                      ) : drop.badge === "bitcoin" ? (
                        <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          ₿
                        </div>
                      ) : (
                        <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          ★
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3 relative z-10">
                    <h3 className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors duration-300">
                      {drop.name}
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-dark-400">PRICE</div>
                        <div className="text-white font-medium">{drop.price}</div>
                      </div>
                      <div>
                        <div className="text-dark-400">ITEMS</div>
                        <div className="text-white font-medium flex items-center">
                          {drop.items}
                          {drop.items === "TBA" && <Info className="w-3 h-3 ml-1 text-dark-400" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-dark-400">MINTED</div>
                        <div className="text-white font-medium">{drop.minted}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-sm font-medium">{drop.status}</span>
                        <span className="text-dark-400 text-sm">
                          {drop.status === "starts" ? "starts:" : "ends:"} {drop.timeLeft}
                        </span>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* See All Button */}
            <div className="absolute right-4 top-0">
              <button className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-1 text-sm font-medium">
                <span>See all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Biggest Movers Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Biggest Movers in NFTs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {biggestMovers.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                className="bg-dark-800 rounded-xl p-4 hover:shadow-xl transition-all duration-300 relative group"
              >
                {/* Multicolor stroke effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 via-slate-400 via-indigo-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                <div className="absolute inset-0.5 rounded-xl bg-dark-800"></div>
                <div className="flex items-center space-x-3 mb-4 relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">{item.name}</h3>
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <TrendingUp className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                      <span>{item.change}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400 group-hover:text-dark-300 transition-colors duration-300">Floor Price</span>
                    <span className="text-white font-medium group-hover:text-indigo-300 transition-colors duration-300">{item.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400 group-hover:text-dark-300 transition-colors duration-300">Volume</span>
                    <span className="text-white font-medium group-hover:text-indigo-300 transition-colors duration-300">{item.volume}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured NFTs Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              Featured NFTs
            </h2>
            <Link
              to="/marketplace"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {featuredNFTs.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="bg-dark-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer relative"
              >
                {/* Multicolor stroke effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 via-slate-400 via-indigo-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>
                <div className="absolute inset-0.5 rounded-xl bg-dark-800"></div>
                <Link to={`/nft/${listing.nft.mint}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={listing.nft.image}
                      alt={listing.nft.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 space-y-2 relative z-10">
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">
                      {listing.nft.name}
                    </h3>
                    <p className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors duration-300">
                      {listing.nft.description?.substring(0, 60)}...
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-lg font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                        {listing.price} SOL
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-dark-500">
                        <div className="flex items-center space-x-1 group-hover:text-dark-400 transition-colors duration-300">
                          <Clock className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>2h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-gradient-to-r from-pink-500 via-yellow-500 via-green-500 to-blue-500 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">$184.26</div>
              <div className="text-white/80 text-sm">Floor Price</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$118,087</div>
              <div className="text-white/80 text-sm">Volume</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$3,632.18</div>
              <div className="text-white/80 text-sm">Market Cap</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home 