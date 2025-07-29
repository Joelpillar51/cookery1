import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  Info,
  Play
} from 'lucide-react'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useWallet } from '../contexts/WalletContext'

const Marketplace: React.FC = () => {
  const { isInitialized, marketplaceData } = useMarketplace()
  const { connected } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    if (connected) {
      navigate('/dashboard')
    }
  }, [connected, navigate])

  const featuredNFTs = [
    {
      id: 1,
      nft: {
        mint: "mint1",
        name: "Cyber Falcon",
        image: "/cyber-falcon.png",
        description: "A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm"
      },
      price: 145.0
    },
    {
      id: 2,
      nft: {
        mint: "mint2",
        name: "Cosmic Voyager",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center",
        description: "A rare cosmic explorer NFT with unique space-time properties"
      },
      price: 2.5
    },
    {
      id: 3,
      nft: {
        mint: "mint3",
        name: "Pixel Warrior",
        image: "/pixel warrior.png",
        description: "Retro pixel warrior with vibrant colors and battle-ready stance"
      },
      price: 3.2
    },
    {
      id: 4,
      nft: {
        mint: "mint4",
        name: "Digital Art",
        image: "/Digital-Art.png",
        description: "Stunning digital art masterpiece with vibrant colors"
      },
      price: 0.9
    },
    {
      id: 5,
      nft: {
        mint: "mint5",
        name: "Abstract Mind",
        image: "/Abstract-Minds.png",
        description: "Mystical abstract consciousness in digital form"
      },
      price: 4.1
    },
    {
      id: 6,
      nft: {
        mint: "mint6",
        name: "Ocean Explorer",
        image: "/ocean-explorer.png",
        description: "Guardian of the deep seas with ancient wisdom"
      },
      price: 2.8
    },
    {
      id: 7,
      nft: {
        mint: "mint7",
        name: "Quantum Explorer",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=300&fit=crop&crop=center",
        description: "Quantum physics inspired NFT with probability waves"
      },
      price: 5.5
    },
    {
      id: 8,
      nft: {
        mint: "mint8",
        name: "Crystal Shard",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=300&fit=crop&crop=center",
        description: "Geometric crystal formation with prismatic effects"
      },
      price: 1.2
    },
    {
      id: 9,
      nft: {
        mint: "mint9",
        name: "Steampunk Mech",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop&crop=center",
        description: "Victorian era mechanical construct with brass and steam"
      },
      price: 3.7
    },
    {
      id: 10,
      nft: {
        mint: "mint10",
        name: "Forest Whisperer",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center",
        description: "Nature spirit connected to ancient forest magic"
      },
      price: 2.1
    },
    {
      id: 11,
      nft: {
        mint: "mint11",
        name: "Digital Phoenix",
        image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=300&h=300&fit=crop&crop=center",
        description: "Mythical digital creature that rises from code ashes"
      },
      price: 6.8
    },
    {
      id: 12,
      nft: {
        mint: "mint12",
        name: "Mad Lad",
        image: "/madlad.png",
        description: "A rebellious character from the Mad Lads collection with unique attitude"
      },
      price: 4.5
    },
    {
      id: 13,
      nft: {
        mint: "mint13",
        name: "Time Traveler",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center",
        description: "Chronological explorer navigating through digital time streams"
      },
      price: 3.9
    },
    {
      id: 14,
      nft: {
        mint: "mint14",
        name: "Neural Network",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center",
        description: "Artificial intelligence consciousness in digital form"
      },
      price: 7.2
    },
    {
      id: 15,
      nft: {
        mint: "mint15",
        name: "Cyberpunk City",
        image: "/AI-Cyberpunk-City.png",
        description: "Futuristic cyberpunk metropolis with neon lights"
      },
      price: 2.3
    },
    {
      id: 16,
      nft: {
        mint: "mint16",
        name: "Crystal Dragon",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center",
        description: "Mythical dragon made of pure crystalline energy"
      },
      price: 8.1
    },
    {
      id: 17,
      nft: {
        mint: "mint17",
        name: "Digital Nomad",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
        description: "Wanderer of the digital realm seeking new experiences"
      },
      price: 1.8
    },
    {
      id: 18,
      nft: {
        mint: "mint18",
        name: "Quantum Cat",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=300&fit=crop&crop=center",
        description: "Feline existing in multiple quantum states simultaneously"
      },
      price: 4.7
    },
    {
      id: 19,
      nft: {
        mint: "mint19",
        name: "Neon Samurai",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=300&fit=crop&crop=center",
        description: "Ancient warrior with modern neon enhancements"
      },
      price: 5.9
    },
    {
      id: 20,
      nft: {
        mint: "mint20",
        name: "Digital Garden",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop&crop=center",
        description: "Lush digital landscape growing in virtual space"
      },
      price: 3.4
    }
  ]

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
    },
    {
      id: 5,
      name: "Pixel Warriors",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center",
      price: "0.05 SOL",
      items: "10K",
      minted: "45%",
      status: "Live",
      timeLeft: "02d 12h 15m",
      chain: "solana",
      badge: "green"
    },
    {
      id: 6,
      name: "Cosmic Dreams",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
      price: "0.08 ETH",
      items: "2.5K",
      minted: "78%",
      status: "Live",
      timeLeft: "12h 45m",
      chain: "ethereum",
      badge: "green"
    },
    {
      id: 7,
      name: "Neon City",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center",
      price: "0.015 BTC",
      items: "1.8K",
      minted: "32%",
      status: "Live",
      timeLeft: "03d 08h 22m",
      chain: "bitcoin",
      badge: "bitcoin"
    },
    {
      id: 8,
      name: "Ocean Depths",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
      price: "FREE",
      items: "∞",
      minted: "1.2K",
      status: "Live",
      timeLeft: "07d 14h 33m",
      chain: "polygon",
      badge: "open-edition"
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
    },
    {
      name: "Azuki",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center",
      price: "$12.34",
      volume: "$67,890",
      change: "+22.1%"
    },
    {
      name: "Moonbirds",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center",
      price: "$8.76",
      volume: "$34,567",
      change: "+5.3%"
    },
    {
      name: "CloneX",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      price: "$6.92",
      volume: "$23,456",
      change: "+18.9%"
    },
    {
      name: "Meebits",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
      price: "$4.56",
      volume: "$12,345",
      change: "+9.7%"
    },
    {
      name: "Cool Cats",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop&crop=center",
      price: "$3.21",
      volume: "$8,901",
      change: "+14.2%"
    }
  ]

  return (
    <>
      <div className="w-full">
        {/* Marketplace Status Banner */}
        {connected && (
          <div className="w-full mb-6">
            {!isInitialized ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Info className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-medium">Marketplace Not Initialized</h3>
                      <p className="text-yellow-300 text-sm">Initialize the marketplace to start trading NFTs</p>
                    </div>
                  </div>
                  <Link
                    to="/marketplace/init"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Initialize Now
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-green-400 font-medium">
                        {marketplaceData?.name || 'NFT Marketplace'} - Active
                      </h3>
                      <p className="text-green-300 text-sm">
                        Platform Fee: {((marketplaceData?.feeBps || 0) / 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/marketplace/settings"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Manage Settings
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Hero Section with Cookery Logo */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-6"
          >
            <img src="/Cookery-svg.svg" alt="Cookery" className="h-16 w-auto" />
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to Cookery
              </h1>
              <p className="text-xl text-dark-300 leading-relaxed">
                Discover, collect, and trade unique NFTs on the Solana blockchain. 
                Experience the future of digital art with zero fees and instant transactions.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Featured NFT Hero Section - Cyber Falcon */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 rounded-2xl overflow-hidden relative group"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* NFT Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src="/cyber-falcon.png"
                      alt="Cyber Falcon"
                      className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                        <span>★</span>
                        <span>FEATURED NFT</span>
                      </div>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 text-black px-4 py-2 rounded-full text-lg font-bold">
                        145 SOL
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Cyber Falcon
                    </h2>
                    <p className="text-xl text-dark-300 leading-relaxed mb-6">
                      A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm. 
                      This masterpiece represents the pinnacle of cybernetic evolution and digital artistry.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">145 SOL</div>
                      <div className="text-dark-400 text-sm">Current Price</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-dark-400 text-sm">Views</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">89</div>
                      <div className="text-dark-400 text-sm">Likes</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">Legendary</div>
                      <div className="text-dark-400 text-sm">Rarity</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-indigo-500 text-indigo-400 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 hover:text-white transition-all duration-300"
                    >
                      Make Offer
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
        
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
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-1 text-sm font-medium"
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
    </>
  )
}

export default Marketplace 