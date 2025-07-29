import React, { createContext, useContext, useState, useEffect } from 'react'
import { useWallet } from './WalletContext'
import { MarketplaceService, MarketplaceData } from '../services/marketplaceService'
import { Connection, PublicKey } from '@solana/web3.js'


interface NFT {
  mint: string
  name: string
  symbol: string
  uri: string
  seller: string
  price: number
  image: string
  description?: string
  attributes?: Array<{ trait_type: string; value: string }>
}

interface Listing {
  id: string
  nft: NFT
  price: number
  seller: string
  createdAt: Date
  status: 'active' | 'sold' | 'cancelled'
}

interface MarketplaceContextType {
  listings: Listing[]
  myNFTs: NFT[]
  loading: boolean
  marketplaceData: MarketplaceData | null
  isInitialized: boolean
  createListing: (nft: NFT, price: number) => Promise<void>
  purchaseNFT: (listingId: string) => Promise<void>
  cancelListing: (listingId: string) => Promise<void>
  initializeMarketplace: (name: string, feeBps: number) => Promise<void>
  updateMarketplaceFee: (feeBps: number) => Promise<void>
  fetchListings: () => Promise<void>
  fetchMyNFTs: () => Promise<void>
  fetchMarketplaceData: () => Promise<void>
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext)
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider')
  }
  return context
}

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([])
  const [myNFTs, setMyNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [marketplaceData, setMarketplaceData] = useState<MarketplaceData | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { connected, publicKey, publicKeyObject, wallet } = useWallet()

  // Initialize marketplace service
  const getMarketplaceService = () => {
    if (!wallet || !connected) return null
    
    const connection = new Connection(process.env.REACT_APP_RPC_URL || 'http://localhost:8899')
    return new MarketplaceService(connection, wallet)
  }

  // Fetch marketplace data
  const fetchMarketplaceData = async () => {
    const service = getMarketplaceService()
    if (!service) return

    try {
      const data = await service.getMarketplaceData()
      setMarketplaceData(data)
      setIsInitialized(!!data)
    } catch (error) {
      console.error('Error fetching marketplace data:', error)
      setIsInitialized(false)
    }
  }

  // Initialize marketplace
  const initializeMarketplace = async (name: string, feeBps: number) => {
    if (!publicKeyObject) throw new Error('Wallet not connected')
    
    const service = getMarketplaceService()
    if (!service) throw new Error('Marketplace service not available')

    setLoading(true)
    try {
      await service.initializeMarketplace(name, feeBps, publicKeyObject)
      await fetchMarketplaceData()
    } catch (error) {
      console.error('Error initializing marketplace:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update marketplace fee
  const updateMarketplaceFee = async (feeBps: number) => {
    if (!publicKeyObject) throw new Error('Wallet not connected')
    
    const service = getMarketplaceService()
    if (!service) throw new Error('Marketplace service not available')

    setLoading(true)
    try {
      await service.updateFee(feeBps, publicKeyObject)
      await fetchMarketplaceData()
    } catch (error) {
      console.error('Error updating marketplace fee:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fetch listings from blockchain
  const fetchListings = async () => {
    const service = getMarketplaceService()
    if (!service) return

    setLoading(true)
    try {
      const listingData = await service.getAllListings()
      
      // Convert blockchain data to frontend format
      const convertedListings: Listing[] = listingData.map((listing, index) => ({
        id: listing.nftMint.toString(),
        nft: {
          mint: listing.nftMint.toString(),
          name: `NFT #${index + 1}`,
          symbol: 'NFT',
          uri: '',
          seller: listing.maker.toString(),
          price: listing.price.toNumber() / 1e9, // Convert from lamports to SOL
          image: `https://images.unsplash.com/photo-${1611224923853 + index}?w=400&h=400&fit=crop`,
          description: `A unique NFT with ID ${listing.nftMint.toString().slice(0, 8)}...`,
        },
        price: listing.price.toNumber() / 1e9,
        seller: listing.maker.toString(),
        createdAt: new Date(),
        status: 'active',
      }))

      setListings(convertedListings)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's NFTs
  const fetchMyNFTs = async () => {
    if (!connected || !publicKey) return
    
    setLoading(true)
    try {
      // In a real app, this would fetch from the blockchain
      // For now, using mock data
      const mockMyNFTs: NFT[] = [
        {
          mint: 'my-mint-1',
          name: 'My First NFT',
          symbol: 'MYNFT',
          uri: 'https://example.com/metadata/my1',
          seller: publicKey || '',
          price: 0,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
          description: 'This is my first NFT creation',
        },
      ]
      setMyNFTs(mockMyNFTs)
    } catch (error) {
      console.error('Error fetching my NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create listing
  const createListing = async (nft: NFT, price: number) => {
    if (!publicKeyObject) throw new Error('Wallet not connected')
    
    const service = getMarketplaceService()
    if (!service) throw new Error('Marketplace service not available')

    setLoading(true)
    try {
      const nftMint = new PublicKey(nft.mint)
      const metadata = new PublicKey(nft.uri || '11111111111111111111111111111111') // Default metadata address
      
      await service.listNFT(nftMint, metadata, price, publicKeyObject)
      await fetchListings() // Refresh listings
    } catch (error) {
      console.error('Error creating listing:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Purchase NFT
  const purchaseNFT = async (listingId: string) => {
    if (!publicKeyObject) throw new Error('Wallet not connected')
    
    const service = getMarketplaceService()
    if (!service) throw new Error('Marketplace service not available')

    setLoading(true)
    try {
      const listing = listings.find(l => l.id === listingId)
      if (!listing) throw new Error('Listing not found')

      const nftMint = new PublicKey(listing.nft.mint)
      await service.purchaseNFT(nftMint, publicKeyObject, listing.price)
      await fetchListings() // Refresh listings
    } catch (error) {
      console.error('Error purchasing NFT:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Cancel listing
  const cancelListing = async (listingId: string) => {
    if (!publicKeyObject) throw new Error('Wallet not connected')
    
    const service = getMarketplaceService()
    if (!service) throw new Error('Marketplace service not available')

    setLoading(true)
    try {
      const listing = listings.find(l => l.id === listingId)
      if (!listing) throw new Error('Listing not found')

      const nftMint = new PublicKey(listing.nft.mint)
      await service.delistNFT(nftMint, publicKeyObject)
      await fetchListings() // Refresh listings
    } catch (error) {
      console.error('Error cancelling listing:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchMarketplaceData()
  }, [connected, publicKey])

  useEffect(() => {
    if (isInitialized) {
      fetchListings()
    }
  }, [isInitialized])

  useEffect(() => {
    if (connected && publicKey) {
      fetchMyNFTs()
    } else {
      setMyNFTs([])
    }
  }, [connected, publicKey])

  const value = {
    listings,
    myNFTs,
    loading,
    marketplaceData,
    isInitialized,
    createListing,
    purchaseNFT,
    cancelListing,
    initializeMarketplace,
    updateMarketplaceFee,
    fetchListings,
    fetchMyNFTs,
    fetchMarketplaceData,
  }

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  )
} 