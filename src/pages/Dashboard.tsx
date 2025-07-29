import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Layers, 
  TrendingUp, 
  Heart,
  Settings,
  Wallet,
  LogOut,
  Search,
  Bell,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  DollarSign,
  Users,
  ShoppingBag,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Grid3X3,
  List,
  Trash2,
  Image,
  Copy,
  ChevronDown,
  FileText,
  ArrowLeft,
  ArrowDown,
  Share2,
  User,
  X,
  // Activity icons
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  ShoppingCart,
  Gem,
  CheckCircle as CheckCircleIcon,
  Palette,
  TrendingUp as TrendingUpIcon,
  RefreshCw
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useNavigate } from 'react-router-dom'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import toast from 'react-hot-toast'
import PriceChart from '../components/PriceChart'

const Dashboard: React.FC = () => {
  const { connected, publicKey, publicKeyObject, wallet, disconnect } = useWallet()
  const { listings } = useMarketplace()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('dashboard')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  
  // List page state
  const [selectedNFT, setSelectedNFT] = useState<any>(null)

  
  // My NFTs tabs state
  const [activeNFTTab, setActiveNFTTab] = useState<'all' | 'draft' | 'pending' | 'active' | 'sold'>('all')
  
  // NFT Collection Creation state
  const [collectionName, setCollectionName] = useState<string>('')
  const [collectionSymbol, setCollectionSymbol] = useState<string>('')
  const [collectionImage, setCollectionImage] = useState<File | null>(null)
  const [collectionDescription, setCollectionDescription] = useState<string>('')
  const [nftArtType, setNftArtType] = useState<'same' | 'unique'>('same')
  const [mintPrice, setMintPrice] = useState<string>('')
  const [royaltyFee, setRoyaltyFee] = useState<string>('')
  const [maxSupply, setMaxSupply] = useState<string>('')
  const [mintLimitPerWallet, setMintLimitPerWallet] = useState<string>('')
  const [mintStartDateTime, setMintStartDateTime] = useState<string>('')
  const [mintType, setMintType] = useState<'public' | 'private'>('public')
  const [mintStages, setMintStages] = useState<any[]>([
    {
      id: 1,
      name: 'Public Mint',
      type: 'public',
      startTime: 'Jul 25 2025, 3:08 PM',
      endTime: 'Jul 26 2025, 3:08 PM',
      price: 'FREE'
    }
  ])

  // Real-time Activities state
  const [activities, setActivities] = useState<any[]>([])
  const [lastActivityUpdate, setLastActivityUpdate] = useState<Date>(new Date())

  // NFT Detail real-time state
  const [nftDetailData, setNftDetailData] = useState<any>({
    listPrice: 1.5,
    floorPrice: 1.2,
    topOffer: 1.3,
    views: 1200,
    likes: 89,
    isLiked: false,
    offers: [
      { id: 1, amount: 1.3, bidder: '0x5e1...8f9a', time: '2 hours ago', status: 'active' },
      { id: 2, amount: 1.2, bidder: '0x3b4...6e2c', time: '4 hours ago', status: 'active' },
      { id: 3, amount: 1.1, bidder: '0x9a2...4c7d', time: '6 hours ago', status: 'active' }
    ],
    activities: [
      { id: 1, type: 'buy', price: 1.5, user: '0x7f3...2a1b', time: '2 hours ago', color: 'green' },
      { id: 2, type: 'list', price: 1.5, user: '0x9a2...4c7d', time: '3 hours ago', color: 'blue' },
      { id: 3, type: 'offer', price: 1.3, user: '0x5e1...8f9a', time: '5 hours ago', color: 'yellow' },
      { id: 4, type: 'transfer', price: null, user: '0x3b4...6e2c', time: '1 day ago', color: 'purple' }
    ],
    collectionStats: {
      totalItems: 1234,
      floorPrice: 1.2,
      owners: 456,
      volume: 2500
    },
    priceHistory: [
      { date: '2024-01-01', price: 1.0 },
      { date: '2024-01-02', price: 1.1 },
      { date: '2024-01-03', price: 1.3 },
      { date: '2024-01-04', price: 1.2 },
      { date: '2024-01-05', price: 1.4 },
      { date: '2024-01-06', price: 1.5 },
      { date: '2024-01-07', price: 1.5 }
    ]
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)


  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: Home },
    { name: 'My NFTs', href: 'my-nfts', icon: Layers },
    { name: 'Statistics', href: 'statistics', icon: TrendingUp },
    { name: 'Favorites', href: 'favorites', icon: Heart },
    { name: 'List', href: 'list', icon: Plus },
  ]

  const profileLinks = [
    { name: 'Settings', href: 'settings', icon: Settings },
    { name: 'Wallet', href: 'wallet', icon: Wallet },
    { name: 'Logout', href: '/logout', icon: LogOut },
  ]

  // Mock data for dashboard
  const topCollections = [
    { id: 1, name: 'Pixel Warriors', image: '/pixel warrior.png', value: '2,340 SOL', change: '+23.4%', items: 1000 },
    { id: 2, name: 'Digital Arts', image: '/Digital-Art.png', value: '1,890 SOL', change: '+18.7%', items: 850 },
    { id: 3, name: 'Mad Lads', image: '/madlad.png', value: '1,567 SOL', change: '-5.2%', items: 500 },
    { id: 4, name: 'Cyber Falcons', image: '/cyber-falcon.png', value: '1,234 SOL', change: '+12.3%', items: 750 },
    { id: 5, name: 'Ocean Explorers', image: '/ocean-explorer.png', value: '987 SOL', change: '+8.9%', items: 600 },
    { id: 6, name: 'Abstract Minds', image: '/Abstract-Minds.png', value: '756 SOL', change: '+15.6%', items: 400 }
  ]

  const spotlightNFTs = [
    { id: 1, name: 'Cyber Falcon', image: '/cyber-falcon.png', price: '145 SOL', timeLeft: '2h 15m', verified: true },
    { id: 2, name: 'Digital Art', image: '/Digital-Art.png', price: '89 SOL', timeLeft: '1d 3h', verified: false },
    { id: 3, name: 'Pixel Warrior', image: '/pixel warrior.png', price: '67 SOL', timeLeft: '4h 30m', verified: true },
    { id: 4, name: 'Cyberpunk City', image: '/AI-Cyberpunk-City.png', price: '123 SOL', timeLeft: '6h 45m', verified: false },
    { id: 5, name: 'Ocean Explorer', image: '/ocean-explorer.png', price: '78 SOL', timeLeft: '3h 20m', verified: true },
    { id: 6, name: 'Abstract Mind', image: '/Abstract-Minds.png', price: '156 SOL', timeLeft: '5h 10m', verified: false },
    { id: 7, name: 'Cosmic Explorer', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop', price: '92 SOL', timeLeft: '1d 8h', verified: true },
    { id: 8, name: 'Golden Falcon', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=200&fit=crop', price: '134 SOL', timeLeft: '7h 45m', verified: true },
    { id: 9, name: 'Mad Lad', image: '/madlad.png', price: '201 SOL', timeLeft: '2d 1h', verified: false },
    { id: 10, name: 'Neon City', image: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=200&h=200&fit=crop', price: '167 SOL', timeLeft: '4h 30m', verified: true }
  ]



  // Mock statistics data
  const stats = {
    totalVolume: 12450.67,
    totalSales: 892,
    activeListings: listings.length,
    uniqueUsers: 1247,
    averagePrice: 13.95,
    volumeChange: 12.5,
    salesChange: -3.2,
    listingsChange: 8.7,
    usersChange: 15.3
  }

  // Mock favorites data
  const favorites = [
    {
      id: '1',
      name: 'Cosmic Explorer #001',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      price: 2.5,
      collection: 'Cosmic Explorers',
      likedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '2h 15m',
      rarity: 'Legendary'
    },
    {
      id: '2',
      name: 'Digital Art Masterpiece',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      price: 1.8,
      collection: 'Digital Arts',
      likedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isListed: false,
      rarity: 'Epic'
    },
    {
      id: '3',
      name: 'Pixel Warrior #042',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      price: 3.2,
      collection: 'Pixel Warriors',
      likedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '1d 3h',
      rarity: 'Rare'
    },
    {
      id: '4',
      name: 'Neon City Dreams',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      price: 4.1,
      collection: 'Cyberpunk City',
      likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isListed: true,
      timeLeft: '12h 45m',
      rarity: 'Legendary'
    }
  ]

  // Mock user NFTs with status information
  const userNFTs = [
    {
      mint: 'mock-mint-1',
      name: 'Cyber Falcon',
      image: '/cyber-falcon.png',
      description: 'A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm.',
      symbol: 'CYBER',
      collection: 'Cyber Falcons',
      status: 'active',
      price: '145 SOL',
      views: 1247,
      likes: 89,
      createdAt: '2024-01-15'
    },
    {
      mint: 'mock-mint-2',
      name: 'Digital Art Masterpiece',
      image: '/Digital-Art.png',
      description: 'A stunning digital art piece created by a renowned artist.',
      symbol: 'DIGITAL',
      collection: 'Digital Arts',
      status: 'pending',
      price: '1.8 SOL',
      views: 856,
      likes: 45,
      createdAt: '2024-01-20'
    },
    {
      mint: 'mock-mint-3',
      name: 'Pixel Warrior',
      image: '/pixel warrior.png',
      description: 'A fierce pixel warrior ready for battle.',
      symbol: 'PIXEL',
      collection: 'Pixel Warriors',
      status: 'draft',
      price: '3.2 SOL',
      views: 0,
      likes: 0,
      createdAt: '2024-01-25'
    },
    {
      mint: 'mock-mint-4',
      name: 'Cyberpunk City',
      image: '/AI-Cyberpunk-City.png',
      description: 'A cyberpunk cityscape with neon lights.',
      symbol: 'NEON',
      collection: 'Cyberpunk City',
      status: 'sold',
      price: '4.1 SOL',
      views: 2103,
      likes: 156,
      createdAt: '2024-01-10',
      soldAt: '2024-01-18'
    },
    {
      mint: 'mock-mint-5',
      name: 'Ocean Explorer',
      image: '/ocean-explorer.png',
      description: 'A majestic ocean explorer diving into the depths.',
      symbol: 'OCEAN',
      collection: 'Ocean Explorers',
      status: 'active',
      price: '2.9 SOL',
      views: 1678,
      likes: 112,
      createdAt: '2024-01-12'
    },
    {
      mint: 'mock-mint-6',
      name: 'Abstract Mind',
      image: '/Abstract-Minds.png',
      description: 'An abstract representation of consciousness.',
      symbol: 'ABSTRACT',
      collection: 'Abstract Minds',
      status: 'pending',
      price: '1.5 SOL',
      views: 432,
      likes: 23,
      createdAt: '2024-01-22'
    },
    {
      mint: 'mock-mint-7',
      name: 'Digital Art',
      image: '/Digital-Art.png',
      description: 'Exploring the depths of digital creativity.',
      symbol: 'DIGITAL',
      collection: 'Digital Arts',
      status: 'draft',
      price: '2.1 SOL',
      views: 0,
      likes: 0,
      createdAt: '2024-01-28'
    },
    {
      mint: 'mock-mint-8',
      name: 'Mad Lad',
      image: '/madlad.png',
      description: 'A rebellious character from the Mad Lads collection.',
      symbol: 'MADLAD',
      collection: 'Mad Lads',
      status: 'active',
      price: '5.2 SOL',
      views: 3421,
      likes: 234,
      createdAt: '2024-01-08'
    },
    {
      mint: 'mock-mint-9',
      name: 'Quantum Cat',
      image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop',
      description: 'Schrödinger\'s cat in quantum superposition.',
      symbol: 'QUANTUM',
      collection: 'Quantum Physics',
      status: 'sold',
      price: '3.7 SOL',
      views: 1892,
      likes: 134,
      createdAt: '2024-01-05',
      soldAt: '2024-01-15'
    },
    {
      mint: 'mock-mint-10',
      name: 'Crystal Dragon',
      image: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=400&fit=crop',
      description: 'A legendary dragon made of pure crystal.',
      symbol: 'CRYSTAL',
      collection: 'Crystal Beasts',
      status: 'active',
      price: '6.8 SOL',
      views: 2789,
      likes: 198,
      createdAt: '2024-01-03'
    }
  ]

  const filteredFavorites = favorites.filter(nft =>
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

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!connected || !publicKeyObject) {
      setWalletBalance(null)
      return
    }

    setIsLoadingBalance(true)
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
      const balance = await connection.getBalance(publicKeyObject)
      setWalletBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      // Set to 0 instead of null when there's an error
      setWalletBalance(0)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Fetch balance when wallet connects or publicKey changes
  useEffect(() => {
    fetchWalletBalance()
  }, [connected, publicKeyObject])

  // Refresh balance every 30 seconds
  useEffect(() => {
    if (connected) {
      const interval = setInterval(fetchWalletBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [connected])

  // Copy wallet address to clipboard
  const copyWalletAddress = async () => {
    console.log('Copy wallet address clicked')
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString())
        console.log('Wallet address copied:', publicKey.toString())
        toast.success('Wallet address copied to clipboard!')
        setWalletDropdownOpen(false)
      } catch (error) {
        console.error('Failed to copy wallet address:', error)
        toast.error('Failed to copy wallet address')
      }
    } else {
      console.log('No public key available')
      toast.error('No wallet address available')
    }
  }

  // Handle wallet disconnect
  const handleDisconnect = async () => {
    console.log('Disconnect wallet clicked')
    try {
      await disconnect()
      console.log('Wallet disconnected successfully')
      toast.success('Wallet disconnected successfully!')
      setWalletDropdownOpen(false)
      // Navigate to landing page after successful disconnect
      navigate('/')
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.wallet-dropdown')) {
        setWalletDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debug: Log wallet state
  useEffect(() => {
    console.log('Dashboard wallet state:', { connected, publicKey: publicKey?.slice(0, 10) + '...', walletDropdownOpen })
  }, [connected, publicKey, walletDropdownOpen])







  // NFT Collection Creation functions
  const handleCollectionNameChange = (name: string) => {
    setCollectionName(name)
    console.log('Collection name changed:', name)
  }

  const handleCollectionSymbolChange = (symbol: string) => {
    setCollectionSymbol(symbol.toUpperCase())
    console.log('Collection symbol changed:', symbol.toUpperCase())
  }

  const handleCollectionImageChange = (file: File) => {
    setCollectionImage(file)
    console.log('Collection image selected:', file.name)
  }

  const handleCollectionDescriptionChange = (description: string) => {
    setCollectionDescription(description)
    console.log('Collection description changed:', description)
  }

  const handleNFTArtTypeChange = (type: 'same' | 'unique') => {
    setNftArtType(type)
    console.log('NFT art type changed:', type)
  }

  const handleMintPriceChange = (price: string) => {
    setMintPrice(price)
    console.log('Mint price changed:', price)
  }

  const handleRoyaltyFeeChange = (fee: string) => {
    const numFee = parseFloat(fee)
    if (numFee >= 0 && numFee <= 100) {
      setRoyaltyFee(fee)
      console.log('Royalty fee changed:', fee)
    }
  }

  const handleMaxSupplyChange = (supply: string) => {
    setMaxSupply(supply)
    console.log('Max supply changed:', supply)
  }

  const handleMintLimitChange = (limit: string) => {
    setMintLimitPerWallet(limit)
    console.log('Mint limit per wallet changed:', limit)
  }

  const handleMintStartDateTimeChange = (dateTime: string) => {
    setMintStartDateTime(dateTime)
    console.log('Mint start date/time changed:', dateTime)
  }

  const handleMintTypeChange = (type: 'public' | 'private') => {
    setMintType(type)
    console.log('Mint type changed:', type)
  }

  const addMintStage = () => {
    const newStage = {
      id: mintStages.length + 1,
      name: 'Allowlist Stage',
      type: 'allowlist',
      startTime: 'TBD',
      endTime: 'TBD',
      price: '0.00 SOL'
    }
    setMintStages([...mintStages, newStage])
    console.log('Added new mint stage:', newStage)
    toast.success('Allowlist stage added!')
  }

  const removeMintStage = (stageId: number) => {
    setMintStages(mintStages.filter(stage => stage.id !== stageId))
    console.log('Removed mint stage:', stageId)
    toast.success('Mint stage removed!')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file')
        return
      }
      handleCollectionImageChange(file)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleDropImage = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file')
        return
      }
      handleCollectionImageChange(file)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const validateForm = () => {
    if (!collectionName.trim()) {
      toast.error('Collection name is required')
      return false
    }
    if (!collectionSymbol.trim()) {
      toast.error('Collection symbol is required')
      return false
    }
    if (!collectionImage) {
      toast.error('Collection image is required')
      return false
    }
    if (!mintStartDateTime) {
      toast.error('Mint start date & time is required')
      return false
    }
    return true
  }

  const handleCreateNFTCollection = () => {
    if (!validateForm()) {
      return
    }

    const collectionData = {
      name: collectionName,
      symbol: collectionSymbol,
      image: collectionImage,
      description: collectionDescription,
      artType: nftArtType,
      mintPrice: parseFloat(mintPrice) || 0,
      royaltyFee: parseFloat(royaltyFee) || 0,
      maxSupply: parseInt(maxSupply) || 0,
      mintLimitPerWallet: parseInt(mintLimitPerWallet) || 0,
      mintStartDateTime,
      mintType,
      mintStages
    }

    console.log('Creating NFT collection:', collectionData)
    toast.success('NFT collection created successfully!')
    
    // Reset form
    setCollectionName('')
    setCollectionSymbol('')
    setCollectionImage(null)
    setCollectionDescription('')
    setNftArtType('same')
    setMintPrice('')
    setRoyaltyFee('')
    setMaxSupply('')
    setMintLimitPerWallet('')
    setMintStartDateTime('')
    setMintType('public')
    setMintStages([{
      id: 1,
      name: 'Public Mint',
      type: 'public',
      startTime: 'Jul 25 2025, 3:08 PM',
      endTime: 'Jul 26 2025, 3:08 PM',
      price: 'FREE'
    }])
  }

  const handleNFTClick = (nft: any) => {
    setSelectedNFT(nft)
    setActiveSection('nft-detail')
    // Generate unique details for this specific NFT
    const uniqueDetails = generateUniqueNFTDetails(nft)
    setNftDetailData(uniqueDetails)
  }

  // Real-time NFT Detail functions
  const handleLikeNFT = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setNftDetailData((prev: any) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }))
      
      toast.success(nftDetailData.isLiked ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update like status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBuyNow = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsUpdating(true)
    try {
      // Simulate purchase transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add purchase activity
      const newActivity = {
        id: Date.now(),
        type: 'buy',
        price: nftDetailData.listPrice,
        user: publicKey?.slice(0, 6) + '...' + publicKey?.slice(-4),
        time: 'Just now',
        color: 'green'
      }
      
      setNftDetailData((prev: any) => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
        listPrice: null // Remove listing after purchase
      }))
      
      toast.success('NFT purchased successfully!')
      setActiveSection('my-nfts')
    } catch (error) {
      toast.error('Purchase failed. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMakeOffer = () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }
    setShowOfferModal(true)
  }

  const handleSubmitOffer = async () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount')
      return
    }

    setIsUpdating(true)
    try {
      // Simulate offer submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newOffer = {
        id: Date.now(),
        amount: parseFloat(offerAmount),
        bidder: publicKey?.slice(0, 6) + '...' + publicKey?.slice(-4),
        time: 'Just now',
        status: 'active'
      }
      
      setNftDetailData((prev: any) => ({
        ...prev,
        offers: [newOffer, ...prev.offers],
        topOffer: Math.max(prev.topOffer, parseFloat(offerAmount))
      }))
      
      // Add offer activity
      const newActivity = {
        id: Date.now() + 1,
        type: 'offer',
        price: parseFloat(offerAmount),
        user: publicKey?.slice(0, 6) + '...' + publicKey?.slice(-4),
        time: 'Just now',
        color: 'yellow'
      }
      
      setNftDetailData((prev: any) => ({
        ...prev,
        activities: [newActivity, ...prev.activities]
      }))
      
      toast.success('Offer submitted successfully!')
      setShowOfferModal(false)
      setOfferAmount('')
    } catch (error) {
      toast.error('Failed to submit offer')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAcceptOffer = async (offerId: number) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsUpdating(true)
    try {
      // Simulate accepting offer
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const offer = nftDetailData.offers.find((o: any) => o.id === offerId)
      
      // Add sale activity
      const newActivity = {
        id: Date.now(),
        type: 'buy',
        price: offer.amount,
        user: offer.bidder,
        time: 'Just now',
        color: 'green'
      }
      
      setNftDetailData((prev: any) => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
        offers: prev.offers.filter((o: any) => o.id !== offerId),
        listPrice: null // Remove listing after sale
      }))
      
      toast.success('Offer accepted! NFT sold successfully.')
    } catch (error) {
      toast.error('Failed to accept offer')
    } finally {
      setIsUpdating(false)
    }
  }



  const handleShareNFT = async () => {
    try {
      const shareData = {
        title: selectedNFT?.name || 'Check out this NFT',
        text: `View ${selectedNFT?.name} on Cookery NFT Marketplace`,
        url: window.location.href
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share NFT')
    }
  }

  // Simulate real-time price updates
  useEffect(() => {
    if (activeSection === 'nft-detail' && selectedNFT) {
      const interval = setInterval(() => {
        setNftDetailData((prev: any) => ({
          ...prev,
          listPrice: prev.listPrice + (Math.random() - 0.5) * 0.1,
          floorPrice: prev.floorPrice + (Math.random() - 0.5) * 0.05,
          views: prev.views + Math.floor(Math.random() * 5)
        }))
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [activeSection, selectedNFT])

  // Filter NFTs by status
  const getStatusFilteredNFTs = () => {
    if (activeNFTTab === 'all') {
      return userNFTs
    }
    return userNFTs.filter(nft => nft.status === activeNFTTab)
  }

  const getStatusCount = (status: string) => {
    if (status === 'all') {
      return userNFTs.length
    }
    return userNFTs.filter(nft => nft.status === status).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'active':
        return 'bg-green-500 text-white'
      case 'sold':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'pending':
        return 'Pending'
      case 'active':
        return 'Active'
      case 'sold':
        return 'Sold'
      default:
        return status
    }
  }

  // Generate unique NFT details based on NFT data
  const generateUniqueNFTDetails = (nft: any) => {
    const nftId = nft.mint || nft.id || 'unknown'
    const hash = nftId.toString().split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)
    
    // Generate unique prices based on NFT ID
    const basePrice = 0.5 + (hash % 100) / 100
    const listPrice = basePrice + (hash % 50) / 100
    const floorPrice = basePrice - (hash % 30) / 100
    const topOffer = listPrice - (hash % 20) / 100
    
    // Generate unique stats
    const views = 500 + (hash % 2000)
    const likes = 10 + (hash % 200)
    const offers = Math.max(0, (hash % 5) - 1)
    
    // Generate unique collection info
    const collections = [
      'Cyber Falcon', 'Digital Dreams', 'Metaverse Warriors', 'Neon Nights', 
      'Pixel Paradise', 'Crypto Creatures', 'Future Fusion', 'Virtual Visions',
      'Blockchain Beasts', 'Digital Dynasty', 'Crypto Canvas', 'Metaverse Masters'
    ]
    const collection = collections[hash % collections.length]
    
    // Generate unique artist info
    const artists = [
      'Digital Artist Studio', 'Crypto Creator Collective', 'Metaverse Masters',
      'Pixel Perfect Studio', 'Blockchain Art Bureau', 'Digital Dreamers',
      'Virtual Visionaries', 'Crypto Canvas Co.', 'Neon Nights Studio',
      'Future Fusion Foundry', 'Digital Dynasty', 'Metaverse Makers'
    ]
    const artist = artists[hash % artists.length]
    const followers = 1000 + (hash % 5000)
    
    // Generate unique attributes
    const backgrounds = ['Cyber Void', 'Neon City', 'Digital Forest', 'Pixel Plains', 'Metaverse Mountains', 'Crypto Canyon']
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
    const editions = ['1 of 1', '1 of 100', '1 of 500', '1 of 1000', '1 of 5000']
    
    const background = backgrounds[hash % backgrounds.length]
    const rarity = rarities[hash % rarities.length]
    const edition = editions[hash % editions.length]
    
    // Generate unique story
    const stories = [
      `The ${nft.name} represents the fusion of organic life and artificial intelligence. This particular piece captures the moment when a digital entity achieves true consciousness, soaring through the infinite expanse of the metaverse.`,
      `In the depths of the ${collection} collection, ${nft.name} stands as a testament to digital evolution. Each pixel tells a story of transformation and transcendence.`,
      `${nft.name} embodies the spirit of the new digital age, where art and technology merge to create something truly extraordinary.`,
      `This unique piece from the ${collection} series showcases the limitless possibilities of blockchain art, where every detail has been carefully crafted.`,
      `${nft.name} is more than just digital art - it's a window into the future of creativity and ownership in the metaverse.`
    ]
    const story = stories[hash % stories.length]
    
    // Generate unique offers
    const generatedOffers = []
    for (let i = 0; i < offers; i++) {
      const offerAmount = topOffer - (i * 0.1) - (hash % 20) / 100
      const bidderHash = (hash + i * 100) % 1000
      const bidder = `0x${bidderHash.toString(16).padStart(3, '0')}...${(bidderHash + 100).toString(16).padStart(4, '0')}`
      const timeOptions = ['2 hours ago', '4 hours ago', '6 hours ago', '1 day ago', '2 days ago']
      const time = timeOptions[(hash + i) % timeOptions.length]
      
      generatedOffers.push({
        id: Date.now() + i,
        amount: Math.max(0.1, offerAmount),
        bidder,
        time,
        status: 'active'
      })
    }
    
    // Generate unique activities
    const activityTypes = ['buy', 'list', 'offer', 'transfer']
    const activityColors = ['green', 'blue', 'yellow', 'purple']
    const generatedActivities = []
    
    for (let i = 0; i < 4; i++) {
      const type = activityTypes[(hash + i) % activityTypes.length]
      const color = activityColors[(hash + i) % activityColors.length]
      const userHash = (hash + i * 200) % 1000
      const user = `0x${userHash.toString(16).padStart(3, '0')}...${(userHash + 100).toString(16).padStart(4, '0')}`
      const timeOptions = ['2 hours ago', '3 hours ago', '5 hours ago', '1 day ago']
      const time = timeOptions[(hash + i) % timeOptions.length]
      const price = type === 'transfer' ? null : listPrice - (i * 0.1) - (hash % 20) / 100
      
      generatedActivities.push({
        id: Date.now() + i + 100,
        type,
        price: price ? Math.max(0.1, price) : null,
        user,
        time,
        color
      })
    }
    
    return {
      listPrice: Math.max(0.1, listPrice),
      floorPrice: Math.max(0.1, floorPrice),
      topOffer: Math.max(0.1, topOffer),
      views,
      likes,
      isLiked: false,
      offers: generatedOffers,
      activities: generatedActivities,
      collection,
      artist,
      followers,
      background,
      rarity,
      edition,
      story,
      collectionStats: {
        totalItems: 500 + (hash % 2000),
        floorPrice: Math.max(0.1, floorPrice),
        owners: 100 + (hash % 500),
        volume: 1000 + (hash % 5000)
      }
    }
  }

  // Generate real-time activities
  const generateActivities = () => {
    const activityTypes = [
      'nft_listed',
      'nft_sold',
      'nft_bought',
      'offer_made',
      'offer_accepted',
      'collection_created',
      'price_updated',
      'nft_transferred'
    ]

    const activityData = [
      {
        type: 'nft_listed',
        icon: FileTextIcon,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        title: 'NFT Listed',
        description: 'New NFT listed on marketplace'
      },
      {
        type: 'nft_sold',
        icon: DollarSignIcon,
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        title: 'NFT Sold',
        description: 'NFT successfully sold'
      },
      {
        type: 'nft_bought',
        icon: ShoppingCart,
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        title: 'NFT Purchased',
        description: 'NFT purchased from marketplace'
      },
      {
        type: 'offer_made',
        icon: Gem,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        title: 'Offer Made',
        description: 'New offer placed on NFT'
      },
      {
        type: 'offer_accepted',
        icon: CheckCircleIcon,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10',
        title: 'Offer Accepted',
        description: 'Offer accepted by seller'
      },
      {
        type: 'collection_created',
        icon: Palette,
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10',
        title: 'Collection Created',
        description: 'New NFT collection launched'
      },
      {
        type: 'price_updated',
        icon: TrendingUpIcon,
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        title: 'Price Updated',
        description: 'NFT price has been updated'
      },
      {
        type: 'nft_transferred',
        icon: RefreshCw,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
        title: 'NFT Transferred',
        description: 'NFT transferred to new owner'
      }
    ]

    const nftNames = [
      'Cosmic Voyager #001',
      'Digital Dreamer #042',
      'Neon Warrior #156',
      'Pixel Master #789',
      'Ethereal Spirit #333',
      'Ocean Guardian #567',
      'Quantum Explorer #999',
      'Crystal Shard #234',
      'Steampunk Mech #777',
      'Forest Whisperer #444'
    ]

    const userNames = [
      'crypto_whale',
      'nft_collector',
      'digital_artist',
      'metaverse_explorer',
      'blockchain_dev',
      'art_enthusiast',
      'web3_pioneer',
      'digital_nomad',
      'tech_innovator',
      'creative_mind'
    ]

    const newActivities = Array.from({ length: 8 }, (_, index) => {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const activityInfo = activityData.find(data => data.type === activityType)
      const nftName = nftNames[Math.floor(Math.random() * nftNames.length)]
      const userName = userNames[Math.floor(Math.random() * userNames.length)]
      const price = (Math.random() * 10 + 0.5).toFixed(2)
      const timeAgo = Math.floor(Math.random() * 60) + 1
      const timeUnit = timeAgo === 1 ? 'min' : 'mins'

      return {
        id: Date.now() + index,
        type: activityType,
        icon: activityInfo?.icon || FileTextIcon,
        color: activityInfo?.color || 'text-blue-400',
        bgColor: activityInfo?.bgColor || 'bg-blue-400/10',
        title: activityInfo?.title || 'Activity',
        description: activityInfo?.description || 'New activity detected',
        nftName,
        userName,
        price: `${price} SOL`,
        timeAgo: `${timeAgo} ${timeUnit} ago`,
        timestamp: new Date(Date.now() - (timeAgo * 60 * 1000))
      }
    })

    return newActivities
  }

  // Update activities in real-time
  const updateActivities = () => {
    const newActivity = generateActivities()[0] // Generate one new activity
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]) // Keep max 10 activities
    setLastActivityUpdate(new Date())
  }

  // Initialize activities
  useEffect(() => {
    setActivities(generateActivities())
  }, [])

  // Real-time activity updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  // Format time ago
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-dark-400">
            Connect your wallet to access the dashboard.
          </p>
        </div>
      </div>
    )
  }

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl p-6 border border-primary-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
                  <p className="text-dark-300">Track your NFT performance and discover trending collections</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userNFTs.length}</div>
                    <div className="text-sm text-dark-400">Total NFTs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">2.4k</div>
                    <div className="text-sm text-dark-400">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-400">156</div>
                    <div className="text-sm text-dark-400">Total Likes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="card cursor-pointer group hover:bg-dark-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection('list')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">Create Collection</h3>
                    <p className="text-dark-400 text-sm">Launch your new NFT collection</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card cursor-pointer group hover:bg-dark-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection('my-nfts')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors">Manage NFTs</h3>
                    <p className="text-dark-400 text-sm">View and manage your collection</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card cursor-pointer group hover:bg-dark-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection('statistics')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">View Analytics</h3>
                    <p className="text-dark-400 text-sm">Track your performance</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Featured NFT */}
              <div className="lg:col-span-2">
                <div className="card relative overflow-hidden group">
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold text-white">Featured NFT</h2>
                        <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <span>★</span>
                          <span>FEATURED</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-dark-400">
                        <Clock className="w-4 h-4" />
                        <span>Ends in 2h 34m</span>
                      </div>
                    </div>
                    
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => handleNFTClick({ mint: 'cyber-falcon-001', name: 'Cyber Falcon', image: '/cyber-falcon.png', description: 'A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm.' })}
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src="/cyber-falcon.png"
                          alt="Cyber Falcon"
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/90 text-black px-4 py-2 rounded-full text-lg font-bold">
                            145 SOL
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button 
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              nftDetailData.isLiked 
                                ? 'bg-red-500 text-white' 
                                : 'bg-dark-800/80 text-dark-400 hover:bg-dark-700'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLikeNFT()
                            }}
                            disabled={isUpdating}
                          >
                            <Heart className={`w-5 h-5 ${nftDetailData.isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            className="p-2 bg-dark-800/80 rounded-full text-dark-400 hover:bg-dark-700 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShareNFT()
                            }}
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">Cyber Falcon</h3>
                          <p className="text-dark-300 text-sm mt-1">A legendary cyber falcon with chrome armor and red glowing eyes, soaring through the digital realm.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-primary-400 font-semibold text-lg">Current Bid: 145 SOL</p>
                            <p className="text-dark-400 text-sm">by 0x7f3...2a1b</p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="btn-primary hover:scale-105 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle bid placement
                              }}
                            >
                              Place Bid
                            </button>
                            <button 
                              className="border border-primary-500 text-primary-400 px-4 py-2 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle buy now
                              }}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Collections */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Top Collections</h2>
                  <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {topCollections.map((collection, index) => (
                    <motion.div 
                      key={collection.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer group"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNFTClick({ mint: collection.id.toString(), name: collection.name, image: collection.image, description: `Explore the ${collection.name} collection.` })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <img src={collection.image} alt={collection.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">{collection.name}</h4>
                          <div className="flex items-center space-x-2">
                            <p className={`text-sm font-medium ${collection.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {collection.change}
                            </p>
                            <span className="text-dark-400 text-xs">24h</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{collection.value}</div>
                        <div className="text-dark-400 text-xs">{collection.items} items</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spotlights */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Spotlights</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {spotlightNFTs.map((nft) => (
                  <motion.div
                    key={nft.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden cursor-pointer group hover:border-primary-500/50 transition-all duration-300"
                    onClick={() => handleNFTClick({ mint: nft.id.toString(), name: nft.name, image: nft.image, description: 'A unique NFT from the collection.' })}
                  >
                    <div className="relative">
                      <img src={nft.image} alt={nft.name} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center justify-between text-white text-xs">
                          <span className="font-medium">{nft.price}</span>
                          {nft.verified && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-white text-sm truncate group-hover:text-primary-400 transition-colors">{nft.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-dark-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{nft.timeLeft}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-dark-400 text-xs">
                          <Eye className="w-3 h-3" />
                          <span>1.2k</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Live</span>
                  </div>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activities.slice(0, 6).map((activity, index) => (
                  <motion.div 
                    key={activity.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-all duration-200 cursor-pointer group border border-transparent hover:border-dark-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${activity.bgColor}`}>
                        {React.createElement(activity.icon, { 
                          className: `w-5 h-5 ${activity.color}` 
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors truncate">
                            {activity.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${activity.bgColor} ${activity.color}`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-dark-400 text-sm mt-1">
                          <span className="truncate">{activity.nftName}</span>
                          <span>•</span>
                          <span className="truncate">by {activity.userName}</span>
                          <span>•</span>
                          <span className="text-xs">{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-white font-semibold text-sm">{activity.price}</div>
                      <div className="text-green-400 text-xs">+{Math.floor(Math.random() * 20 + 5)}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-dark-700">
                <div className="flex items-center justify-between text-xs text-dark-400">
                  <span>Last updated: {formatTimeAgo(lastActivityUpdate)}</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Real-time updates</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'my-nfts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">My NFTs</h1>
                <p className="text-dark-400">Manage your NFT collection</p>
              </div>
              <button 
                onClick={() => setActiveSection('list')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>List NFT</span>
              </button>
            </div>

            {/* Status Tabs */}
            <div className="bg-dark-800 rounded-lg p-1">
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: 'All', icon: Layers },
                  { key: 'draft', label: 'Draft', icon: FileText },
                  { key: 'pending', label: 'Pending', icon: Clock },
                  { key: 'active', label: 'Active', icon: CheckCircle },
                  { key: 'sold', label: 'Sold', icon: DollarSign }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveNFTTab(tab.key as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeNFTTab === tab.key
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-dark-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeNFTTab === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-dark-600 text-dark-300'
                      }`}>
                        {getStatusCount(tab.key)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {getStatusFilteredNFTs().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-dark-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No {activeNFTTab !== 'all' ? getStatusLabel(activeNFTTab) : ''} NFTs Found
                </h3>
                <p className="text-dark-400 mb-4">
                  {activeNFTTab === 'all' 
                    ? "You don't have any NFTs in your wallet yet."
                    : `You don't have any ${getStatusLabel(activeNFTTab).toLowerCase()} NFTs.`
                  }
                </p>
                <button className="btn-primary">Browse Marketplace</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getStatusFilteredNFTs().map((nft, index) => (
                  <motion.div
                    key={nft.mint}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="nft-card group cursor-pointer"
                    onClick={() => handleNFTClick(nft)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nft.status)}`}>
                          {getStatusLabel(nft.status)}
                        </span>
                      </div>

                      {/* Price Badge */}
                      {nft.status === 'active' && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-dark-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white">
                            {nft.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-dark-400">
                        {nft.description?.substring(0, 60)}...
                      </p>
                      
                      {/* NFT Stats */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-sm text-dark-400">
                          {nft.status === 'sold' ? 'Sold' : 'Owned by you'}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-dark-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{nft.views > 1000 ? `${(nft.views / 1000).toFixed(1)}k` : nft.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{nft.likes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {nft.status === 'draft' && (
                        <div className="flex space-x-2 pt-2">
                          <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs py-2 px-3 rounded transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded transition-colors">
                            Publish
                          </button>
                        </div>
                      )}

                      {nft.status === 'pending' && (
                        <div className="flex space-x-2 pt-2">
                          <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3 rounded transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors">
                            Cancel
                          </button>
                        </div>
                      )}

                      {nft.status === 'active' && (
                        <div className="flex space-x-2 pt-2">
                          <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs py-2 px-3 rounded transition-colors">
                            Edit Listing
                          </button>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors">
                            Delist
                          </button>
                        </div>
                      )}

                      {nft.status === 'sold' && (
                        <div className="pt-2">
                          <div className="text-xs text-green-400 font-medium">
                            Sold for {nft.price}
                          </div>
                          <div className="text-xs text-dark-400">
                            {nft.soldAt}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )

      case 'statistics':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Statistics</h1>
                <p className="text-dark-400">Marketplace analytics and insights</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Volume</p>
                    <p className="text-2xl font-bold text-white">{stats.totalVolume.toLocaleString()} SOL</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{stats.volumeChange}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSales.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                      <span className="text-red-400 text-sm">{stats.salesChange}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Active Listings</p>
                    <p className="text-2xl font-bold text-white">{stats.activeListings}</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{stats.listingsChange}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Unique Users</p>
                    <p className="text-2xl font-bold text-white">{stats.uniqueUsers.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{stats.usersChange}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volume Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Volume Trend</h3>
                  <BarChart3 className="w-5 h-5 text-dark-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 78, 45, 89, 67, 92, 85].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-dark-400">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </motion.div>

              {/* Sales Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Sales Distribution</h3>
                  <PieChart className="w-5 h-5 text-dark-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Art', percentage: 35, color: 'bg-blue-500' },
                    { name: 'Collectibles', percentage: 28, color: 'bg-green-500' },
                    { name: 'Gaming', percentage: 22, color: 'bg-purple-500' },
                    { name: 'Music', percentage: 15, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-white text-sm">{item.name}</span>
                      </div>
                      <span className="text-dark-400 text-sm">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )

      case 'favorites':
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
                    <p className="text-2xl font-bold text-white">{favorites.length}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-400" />
                </div>
              </div>
              
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Listed for Sale</p>
                    <p className="text-2xl font-bold text-white">
                      {favorites.filter(nft => nft.isListed).length}
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
                      {favorites.reduce((sum, nft) => sum + nft.price, 0).toFixed(1)} SOL
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
                            <button className="p-1 text-dark-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* List View Actions */}
                    {viewMode === 'list' && (
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-dark-400 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-dark-400 hover:text-red-400 transition-colors">
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

      case 'list':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create NFT Collection</h1>
                <p className="text-dark-400">Launch your new NFT collection on the marketplace</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-6">Collection Details</h3>
                
                <div className="space-y-6">
                  {/* Basic Collection Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Collection Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cookery"
                        value={collectionName}
                        onChange={(e) => handleCollectionNameChange(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Symbol *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. COOKERY"
                        value={collectionSymbol}
                        onChange={(e) => handleCollectionSymbolChange(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Collection Image */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Collection Image
                    </label>
                    <p className="text-dark-400 text-sm mb-3">
                      Image that will be shown as the main image for the collection. Recommended: 800x800px jpg
                    </p>
                    <div 
                      className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                      onDrop={handleDropImage}
                      onDragOver={handleDragOver}
                    >
                      {collectionImage ? (
                        <div>
                          <div className="w-16 h-16 mx-auto mb-4">
                            <img 
                              src={URL.createObjectURL(collectionImage)} 
                              alt="Collection preview" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-white mb-2">{collectionImage.name}</p>
                          <button 
                            onClick={() => setCollectionImage(null)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-white mb-2">Drop your artwork here to upload</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="collection-image-upload"
                          />
                          <label 
                            htmlFor="collection-image-upload"
                            className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Choose Image...
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="e.g. Cookery is the greatest collection ever made"
                      rows={4}
                      value={collectionDescription}
                      onChange={(e) => handleCollectionDescriptionChange(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>

                  {/* NFT Art Type */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-4">
                      NFT Art Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`bg-dark-700 rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                          nftArtType === 'same' 
                            ? 'border-indigo-500' 
                            : 'border-transparent hover:border-dark-600'
                        }`}
                        onClick={() => handleNFTArtTypeChange('same')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">Same Artwork</h4>
                          {nftArtType === 'same' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-dark-400 text-sm mb-3">An ERC-1155 collection where everyone mints the same artwork</p>
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">NFT</span>
                        </div>
                      </div>
                      <div 
                        className={`bg-dark-700 rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                          nftArtType === 'unique' 
                            ? 'border-indigo-500' 
                            : 'border-transparent hover:border-dark-600'
                        }`}
                        onClick={() => handleNFTArtTypeChange('unique')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">Unique Artwork</h4>
                          {nftArtType === 'unique' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-dark-400 text-sm mb-3">An ERC-721 collection where everyone mints a unique artwork</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">1</span>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">2</span>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-red-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">3</span>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Minting Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Mint Price
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          value={mintPrice}
                          onChange={(e) => handleMintPriceChange(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400">
                          SOL
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center">
                        Royalty Fee
                        <svg className="w-4 h-4 text-dark-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          max="100"
                          value={royaltyFee}
                          onChange={(e) => handleRoyaltyFeeChange(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400">
                          %
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center">
                        Max Supply
                        <svg className="w-4 h-4 text-dark-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        min="1"
                        value={maxSupply}
                        onChange={(e) => handleMaxSupplyChange(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center">
                        Mint Limit per Wallet
                        <svg className="w-4 h-4 text-dark-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <input
                        type="number"
                        placeholder="5"
                        min="1"
                        value={mintLimitPerWallet}
                        onChange={(e) => handleMintLimitChange(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Mint Start Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mint Start Date & Time
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={mintStartDateTime}
                        onChange={(e) => handleMintStartDateTimeChange(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Mint Stages */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-4">
                      Mint Stages
                    </label>
                    <div className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                        onClick={addMintStage}
                      >
                        <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-white">Add Allowlist Stage</p>
                      </div>
                      
                      {mintStages.map((stage) => (
                        <div key={stage.id} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{stage.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">{stage.price}</span>
                                <span className="text-dark-400 text-sm">{stage.startTime}</span>
                              </div>
                              <p className="text-dark-400 text-sm mt-1">Ends: {stage.endTime}</p>
                            </div>
                            <button 
                              onClick={() => removeMintStage(stage.id)}
                              className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mint Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-4">
                      Mint Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`bg-dark-700 rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                          mintType === 'public' 
                            ? 'border-indigo-500' 
                            : 'border-transparent hover:border-dark-600'
                        }`}
                        onClick={() => handleMintTypeChange('public')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">Public Mint</h4>
                          {mintType === 'public' && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-dark-400 text-sm">Anyone can mint your NFTs</p>
                      </div>
                      <div 
                        className={`bg-dark-700 rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                          mintType === 'private' 
                            ? 'border-indigo-500' 
                            : 'border-transparent hover:border-dark-600'
                        }`}
                        onClick={() => handleMintTypeChange('private')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">Private Mint</h4>
                          {mintType === 'private' && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-dark-400 text-sm">Only allowlisted addresses can mint</p>
                      </div>
                    </div>
                  </div>

                  {/* Create NFT Button */}
                  <div className="pt-6">
                    <button 
                      onClick={handleCreateNFTCollection}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Create NFT Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'nft-detail':
        return (
          <div className="space-y-8">
            {/* Back Button */}
            <button 
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            {/* Main NFT Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - NFT Image & Quick Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* NFT Image */}
                <div className="relative group">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full rounded-3xl shadow-2xl"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                        nftDetailData.isLiked 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-black/20 text-white hover:bg-black/40'
                      }`}
                      onClick={handleLikeNFT}
                      disabled={isUpdating}
                    >
                      <Heart className={`w-5 h-5 ${nftDetailData.isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      className="p-3 bg-black/20 rounded-full backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-200"
                      onClick={handleShareNFT}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{nftDetailData.views.toLocaleString()}</div>
                      <div className="text-dark-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{nftDetailData.likes}</div>
                      <div className="text-dark-400">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">1</div>
                      <div className="text-dark-400">Owner</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">2h</div>
                      <div className="text-dark-400">Listed</div>
                    </div>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Contract</span>
                      <span className="text-white font-mono">{selectedNFT.mint.slice(0, 8)}...{selectedNFT.mint.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Token ID</span>
                      <span className="text-white">#{selectedNFT.mint.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Blockchain</span>
                      <span className="text-white">Solana</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Royalty</span>
                      <span className="text-white">5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Created</span>
                      <span className="text-white">March 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Description */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    {selectedNFT.name}
                  </h1>
                  <p className="text-lg text-dark-300 leading-relaxed">
                    {selectedNFT.description}
                  </p>
                </div>

                {/* Price Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
                    <p className="text-sm text-dark-400 mb-1">List Price</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {nftDetailData.listPrice ? `${nftDetailData.listPrice.toFixed(2)} SOL` : 'Not Listed'}
                    </p>
                  </div>
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
                    <p className="text-sm text-dark-400 mb-1">Floor Price</p>
                    <p className="text-2xl font-bold text-green-400">{nftDetailData.floorPrice.toFixed(2)} SOL</p>
                  </div>
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/50">
                    <p className="text-sm text-dark-400 mb-1">Top Offer</p>
                    <p className="text-2xl font-bold text-yellow-400">{nftDetailData.topOffer.toFixed(2)} SOL</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-2xl text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    onClick={handleBuyNow}
                    disabled={isUpdating || !nftDetailData.listPrice || !connected}
                  >
                    {isUpdating ? 'Processing...' : nftDetailData.listPrice ? `Buy Now - ${nftDetailData.listPrice.toFixed(2)} SOL` : 'Not Available'}
                  </button>
                  <button 
                    className="w-full bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 text-white font-semibold py-4 px-6 rounded-2xl text-lg hover:bg-dark-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleMakeOffer}
                    disabled={isUpdating || !connected}
                  >
                    {isUpdating ? 'Processing...' : 'Make Offer'}
                  </button>
                </div>

                {/* About NFT */}
                <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">About this NFT</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Collection</h4>
                      <p className="text-dark-300 text-sm leading-relaxed">
                        This NFT is part of the exclusive {nftDetailData.collection} collection, featuring unique digital art pieces that combine futuristic aesthetics with blockchain technology. Each piece is carefully crafted and represents a moment in the digital evolution.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Artist</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{nftDetailData.artist}</p>
                          <p className="text-dark-400 text-sm">Verified Creator • {nftDetailData.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Attributes</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-dark-700/30 rounded-lg p-3">
                          <p className="text-dark-400 text-xs mb-1">Background</p>
                          <p className="text-white text-sm font-medium">{nftDetailData.background}</p>
                        </div>
                        <div className="bg-dark-700/30 rounded-lg p-3">
                          <p className="text-dark-400 text-xs mb-1">Rarity</p>
                          <p className="text-white text-sm font-medium">{nftDetailData.rarity}</p>
                        </div>
                        <div className="bg-dark-700/30 rounded-lg p-3">
                          <p className="text-dark-400 text-xs mb-1">Edition</p>
                          <p className="text-white text-sm font-medium">{nftDetailData.edition}</p>
                        </div>
                        <div className="bg-dark-700/30 rounded-lg p-3">
                          <p className="text-dark-400 text-xs mb-1">Created</p>
                          <p className="text-white text-sm font-medium">March 2024</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Story</h4>
                      <p className="text-dark-300 text-sm leading-relaxed">
                        {nftDetailData.story}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Utility</h4>
                      <ul className="text-dark-300 text-sm space-y-1">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          <span>Access to exclusive Discord community</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          <span>Early access to future collections</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          <span>Governance rights in DAO</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          <span>Staking rewards eligibility</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Offers */}
              <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Offers</h3>
                  <span className="text-sm text-dark-400">{nftDetailData.offers.length} offers</span>
                </div>
                <div className="space-y-3">
                  {nftDetailData.offers.length > 0 ? (
                    nftDetailData.offers.map((offer: any, index: number) => (
                      <div key={offer.id} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{offer.amount.toFixed(2)} SOL</p>
                            <p className="text-dark-400 text-sm">by {offer.bidder} • {offer.time}</p>
                          </div>
                        </div>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleAcceptOffer(offer.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Processing...' : 'Accept'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-dark-400">No offers yet</p>
                      <p className="text-sm text-dark-500">Be the first to make an offer!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {nftDetailData.activities.length > 0 ? (
                    nftDetailData.activities.map((activity: any) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-dark-700/30 rounded-xl">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.color === 'green' ? 'bg-green-500/20' :
                          activity.color === 'blue' ? 'bg-blue-500/20' :
                          activity.color === 'yellow' ? 'bg-yellow-500/20' :
                          activity.color === 'purple' ? 'bg-purple-500/20' : 'bg-gray-500/20'
                        }`}>
                          <span className={`text-sm font-bold ${
                            activity.color === 'green' ? 'text-green-400' :
                            activity.color === 'blue' ? 'text-blue-400' :
                            activity.color === 'yellow' ? 'text-yellow-400' :
                            activity.color === 'purple' ? 'text-purple-400' : 'text-gray-400'
                          }`}>
                            {activity.type === 'buy' ? 'B' :
                             activity.type === 'list' ? 'L' :
                             activity.type === 'offer' ? 'O' :
                             activity.type === 'transfer' ? 'T' : 'A'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            {activity.type === 'buy' ? `Bought for ${activity.price} SOL` :
                             activity.type === 'list' ? `Listed for ${activity.price} SOL` :
                             activity.type === 'offer' ? `Offer of ${activity.price} SOL` :
                             activity.type === 'transfer' ? 'Transferred' : 'Activity'}
                          </p>
                          <p className="text-dark-400 text-xs">by {activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-dark-400">No activities yet</p>
                      <p className="text-sm text-dark-500">Be the first to interact with this NFT!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <PriceChart 
              mint={selectedNFT?.mint || 'mock-mint'} 
              currentPrice={nftDetailData?.listPrice || 0} 
            />

            {/* Offer Modal */}
            {showOfferModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Make an Offer</h3>
                    <button 
                      onClick={() => setShowOfferModal(false)}
                      className="text-dark-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Offer Amount (SOL)
                      </label>
                      <input
                        type="number"
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowOfferModal(false)}
                        className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitOffer}
                        disabled={isUpdating || !offerAmount}
                        className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? 'Submitting...' : 'Submit Offer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-8">
            {/* Back Button */}
            <button 
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            {/* Settings Content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              
              {/* Profile Settings */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue="cookery_user"
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="user@cookery.com"
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">Bio</label>
                    <textarea
                      defaultValue="NFT enthusiast and collector"
                      rows={3}
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Wallet Settings */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Wallet Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Auto-connect wallet</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Show balance in header</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Confirm transactions</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">New listings</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Price changes</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Offers</span>
                    <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'wallet':
        return (
          <div className="space-y-8">
            {/* Back Button */}
            <button 
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center space-x-2 text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            {/* Wallet Content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Wallet</h1>
              
              {/* Wallet Overview */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Wallet Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {walletBalance !== null ? walletBalance.toFixed(4) : '0.00'} SOL
                    </div>
                    <div className="text-sm text-dark-400">Balance</div>
                  </div>
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <div className="text-2xl font-bold text-white">{userNFTs.length}</div>
                    <div className="text-sm text-dark-400">NFTs Owned</div>
                  </div>
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-sm text-dark-400">Transactions</div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <ArrowDown className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Received SOL</div>
                          <div className="text-sm text-dark-400">2 hours ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">+0.5 SOL</div>
                        <div className="text-sm text-green-400">Success</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 sidebar flex flex-col fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <img src="/Cookery-svg.svg" alt="Cookery" className="h-8 w-auto" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.href)}
                className={`sidebar-item w-full text-left ${activeSection === item.href ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Separator */}
        <div className="px-4 py-2">
          <div className="border-t border-dark-700"></div>
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-6">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
            MY PROFILE
          </h3>
          <nav className="space-y-2">
            {profileLinks.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.href)}
                  className={`sidebar-item w-full text-left ${activeSection === item.href ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-dark-900 border-b border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search NFTs, collections, artists..."
                  className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-dark-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Wallet Balance */}
              <div className="text-sm text-white">
                Balance: 
                {isLoadingBalance ? (
                  <span className="text-purple-400 font-semibold ml-1">
                    <div className="inline-block w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  </span>
                ) : (
                  <span className="text-purple-400 font-semibold ml-1">
                    {walletBalance !== null ? walletBalance.toFixed(4) : '0.00'} SOL
                  </span>
                )}
              </div>



              {/* Wallet Button with Dropdown */}
              <div className="relative wallet-dropdown">
                {/* Debug indicator */}
                {walletDropdownOpen && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full z-[10000]"></div>
                )}
                
                <button
                  onClick={() => {
                    console.log('Dashboard wallet button clicked, current state:', walletDropdownOpen)
                    setWalletDropdownOpen(!walletDropdownOpen)
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dark-900 flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {publicKey ? publicKey.slice(0, 2).toUpperCase() : '?'}
                    </span>
                  </div>
                  <span className="hidden sm:block">
                    {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Wallet'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Wallet Dropdown Menu */}
                {walletDropdownOpen && connected && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-xl border border-dark-600 py-2 z-[9999]">
                    <div className="px-4 py-3 border-b border-dark-600">
                      <div className="text-sm text-white font-medium">
                        {wallet?.adapter?.name || 'Wallet'}
                      </div>
                      <div className="text-xs text-dark-400 mt-1">
                        {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Not connected'}
                      </div>
                    </div>
                    
                    <button
                      onClick={copyWalletAddress}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Address</span>
                    </button>
                    
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard 