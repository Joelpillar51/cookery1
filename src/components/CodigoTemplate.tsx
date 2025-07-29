import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Store, 
  Plus, 
  ShoppingCart, 
  Trash2, 
  Settings,
  Wallet,
  Image,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../contexts/MarketplaceContext'
import toast from 'react-hot-toast'

// Codigo NFT Marketplace Template - Core Functions
const CodigoTemplate: React.FC = () => {
  const { connected } = useWallet()
  const { 
    initializeMarketplace, 
    createListing, 
    purchaseNFT, 
    cancelListing, 
    updateMarketplaceFee,
    isInitialized,
    marketplaceData,
    listings 
  } = useMarketplace()

  // Form states for each function
  const [initForm, setInitForm] = useState({ name: 'Codigo NFT Marketplace', fee: 250 })
  const [listForm, setListForm] = useState({ price: '', nftMint: '' })
  const [purchaseForm, setPurchaseForm] = useState({ listingId: '' })
  const [delistForm, setDelistForm] = useState({ listingId: '' })
  const [feeForm, setFeeForm] = useState({ newFee: '' })

  // Loading states
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // Function 1: Initialize Marketplace
  const handleInitializeMarketplace = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading('init')
    try {
      await initializeMarketplace(initForm.name, initForm.fee)
      toast.success('Marketplace initialized successfully!')
    } catch (error) {
      toast.error('Failed to initialize marketplace')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  // Function 2: List NFT
  const handleListNFT = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!listForm.price || !listForm.nftMint) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading('list')
    try {
      // Create a mock NFT object for the listing
      const mockNFT = {
        mint: listForm.nftMint,
        name: `NFT ${listForm.nftMint.slice(0, 8)}...`,
        symbol: 'NFT',
        uri: '',
        seller: '',
        price: 0,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      }
      await createListing(mockNFT, parseFloat(listForm.price))
      toast.success('NFT listed successfully!')
      setListForm({ price: '', nftMint: '' })
    } catch (error) {
      toast.error('Failed to list NFT')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  // Function 3: Purchase NFT
  const handlePurchaseNFT = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!purchaseForm.listingId) {
      toast.error('Please select a listing')
      return
    }

    setIsLoading('purchase')
    try {
      await purchaseNFT(purchaseForm.listingId)
      toast.success('NFT purchased successfully!')
      setPurchaseForm({ listingId: '' })
    } catch (error) {
      toast.error('Failed to purchase NFT')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  // Function 4: Delist NFT
  const handleDelistNFT = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!delistForm.listingId) {
      toast.error('Please select a listing')
      return
    }

    setIsLoading('delist')
    try {
      await cancelListing(delistForm.listingId)
      toast.success('NFT delisted successfully!')
      setDelistForm({ listingId: '' })
    } catch (error) {
      toast.error('Failed to delist NFT')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  // Function 5: Update Fee
  const handleUpdateFee = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!feeForm.newFee) {
      toast.error('Please enter new fee')
      return
    }

    setIsLoading('fee')
    try {
      await updateMarketplaceFee(parseInt(feeForm.newFee))
      toast.success('Marketplace fee updated successfully!')
      setFeeForm({ newFee: '' })
    } catch (error) {
      toast.error('Failed to update fee')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const functionCards = [
    {
      id: 'init',
      title: 'Initialize Marketplace',
      description: 'Set up the marketplace with name and fee configuration',
      icon: Store,
      color: 'from-blue-500 to-purple-600',
      action: handleInitializeMarketplace,
      disabled: isInitialized,
      form: (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Marketplace Name"
            value={initForm.name}
            onChange={(e) => setInitForm({ ...initForm, name: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          />
          <input
            type="number"
            placeholder="Fee (basis points)"
            value={initForm.fee}
            onChange={(e) => setInitForm({ ...initForm, fee: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          />
        </div>
      )
    },
    {
      id: 'list',
      title: 'List NFT',
      description: 'List an NFT for sale with a specified price',
      icon: Plus,
      color: 'from-green-500 to-emerald-600',
      action: handleListNFT,
      disabled: !isInitialized,
      form: (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={listForm.nftMint}
            onChange={(e) => setListForm({ ...listForm, nftMint: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          />
          <input
            type="number"
            placeholder="Price (SOL)"
            value={listForm.price}
            onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          />
        </div>
      )
    },
    {
      id: 'purchase',
      title: 'Purchase NFT',
      description: 'Buy an NFT from the marketplace',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      action: handlePurchaseNFT,
      disabled: !isInitialized || listings.length === 0,
      form: (
        <div className="space-y-3">
          <select
            value={purchaseForm.listingId}
            onChange={(e) => setPurchaseForm({ ...purchaseForm, listingId: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          >
            <option value="">Select a listing</option>
            {listings.map((listing: any) => (
              <option key={listing.id} value={listing.id}>
                {listing.nft.name} - {listing.price} SOL
              </option>
            ))}
          </select>
        </div>
      )
    },
    {
      id: 'delist',
      title: 'Delist NFT',
      description: 'Remove an NFT from the marketplace',
      icon: Trash2,
      color: 'from-red-500 to-orange-600',
      action: handleDelistNFT,
      disabled: !isInitialized || listings.length === 0,
      form: (
        <div className="space-y-3">
          <select
            value={delistForm.listingId}
            onChange={(e) => setDelistForm({ ...delistForm, listingId: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          >
            <option value="">Select a listing</option>
            {listings.map((listing: any) => (
              <option key={listing.id} value={listing.id}>
                {listing.nft.name} - {listing.price} SOL
              </option>
            ))}
          </select>
        </div>
      )
    },
    {
      id: 'fee',
      title: 'Update Fee',
      description: 'Update the marketplace fee configuration',
      icon: Settings,
      color: 'from-yellow-500 to-orange-600',
      action: handleUpdateFee,
      disabled: !isInitialized,
      form: (
        <div className="space-y-3">
          <input
            type="number"
            placeholder="New Fee (basis points)"
            value={feeForm.newFee}
            onChange={(e) => setFeeForm({ ...feeForm, newFee: e.target.value })}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
          />
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/Cookery-svg.svg" alt="Cookery" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Codigo NFT Marketplace Template
          </h1>
          <p className="text-dark-400 text-lg">
            Frontend implementation for the Codigo free tier NFT Marketplace template
          </p>
          
          {/* Connection Status */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <Wallet className="w-4 h-4" />
              <span>{connected ? 'Wallet Connected' : 'Wallet Disconnected'}</span>
            </div>
            
            {isInitialized && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Marketplace Initialized</span>
              </div>
            )}
          </div>
        </div>

        {/* Template Functions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functionCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 rounded-xl p-6 border border-dark-700"
              >
                {/* Card Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                    <p className="text-sm text-dark-400">{card.description}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="mb-4">
                  {card.form}
                </div>

                {/* Action Button */}
                <button
                  onClick={card.action}
                  disabled={card.disabled || isLoading === card.id}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    card.disabled
                      ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${card.color} text-white hover:opacity-90`
                  }`}
                >
                  {isLoading === card.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    card.title
                  )}
                </button>

                {/* Status Indicator */}
                {card.disabled && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-dark-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      {card.id === 'init' && isInitialized ? 'Marketplace already initialized' :
                       card.id === 'list' && !isInitialized ? 'Marketplace not initialized' :
                       card.id === 'purchase' && listings.length === 0 ? 'No listings available' :
                       card.id === 'delist' && listings.length === 0 ? 'No listings available' :
                       card.id === 'fee' && !isInitialized ? 'Marketplace not initialized' :
                       'Action not available'}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Marketplace Info */}
        {isInitialized && marketplaceData && (
          <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-2xl font-bold text-white mb-4">Marketplace Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Name</span>
                </div>
                <p className="text-dark-300">{marketplaceData.name}</p>
              </div>
              
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Fee</span>
                </div>
                <p className="text-dark-300">{(marketplaceData.feeBps / 100).toFixed(2)}%</p>
              </div>
              
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Image className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Active Listings</span>
                </div>
                <p className="text-dark-300">{listings.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Template Documentation */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h2 className="text-2xl font-bold text-white mb-4">Codigo Template Functions</h2>
          <div className="space-y-4 text-dark-300">
            <p>This frontend implements all 5 core functions from the Codigo NFT Marketplace template:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>initialize_marketplace</strong> - Set up marketplace configuration</li>
              <li><strong>list_nft</strong> - List NFTs for sale</li>
              <li><strong>purchase_nft</strong> - Buy NFTs from marketplace</li>
              <li><strong>delist_nft</strong> - Remove NFTs from sale</li>
              <li><strong>update_fee</strong> - Update marketplace fees</li>
            </ul>
            <p className="mt-4 text-sm text-dark-400">
              Built with React, TypeScript, and Tailwind CSS. Integrates with Solana blockchain using Anchor framework.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodigoTemplate 