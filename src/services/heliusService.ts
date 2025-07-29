// Helius API Service for NFT price data
// Based on https://www.helius.xyz and https://docs.helius.xyz/

const HELIUS_API_KEY = 'YOUR_HELIUS_API_KEY' // Replace with your actual API key
const HELIUS_BASE_URL = 'https://api.helius.xyz/v0'

export interface PriceDataPoint {
  timestamp: number
  price: number
  volume?: number
}

export interface NFTPriceHistory {
  mint: string
  data: PriceDataPoint[]
  timeframe: string
  change24h: number
  change7d: number
  change30d: number
  volume24h: number
  floorPrice: number
  highestPrice: number
}

export class HeliusService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${HELIUS_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HELIUS_API_KEY}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get NFT price history using Helius NFT API
  static async getNFTPriceHistory(
    mint: string, 
    timeframe: '7D' | '30D' | '90D' = '7D',
    currentListingPrice?: number
  ): Promise<NFTPriceHistory> {
    try {
      // For demo purposes, we'll generate realistic mock data
      // In production, you would use actual Helius API calls
      
      const days = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90
      const data: PriceDataPoint[] = []
      
      // Use current listing price as base, or generate random if not provided
      const basePrice = currentListingPrice || (0.5 + Math.random() * 2)
      const volatility = 0.1 // 10% daily volatility
      
      for (let i = days; i >= 0; i--) {
        const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000)
        
        // Create more realistic price movement
        // Start from a lower price and trend towards current listing price
        const progress = (days - i) / days // 0 to 1
        const trendFactor = Math.sin(progress * Math.PI) * 0.3 // Smooth trend
        const randomChange = (Math.random() - 0.5) * 2 * volatility
        const price = basePrice * (0.7 + trendFactor + randomChange)
        
        data.push({
          timestamp,
          price: Math.max(0.1, price),
          volume: Math.random() * 100 + 10
        })
      }

      // Calculate price changes
      const currentPrice = data[data.length - 1].price
      const price24h = data[data.length - 2]?.price || currentPrice
      const price7d = data[Math.max(0, data.length - 8)]?.price || currentPrice
      const price30d = data[Math.max(0, data.length - 31)]?.price || currentPrice

      return {
        mint,
        data,
        timeframe,
        change24h: ((currentPrice - price24h) / price24h) * 100,
        change7d: ((currentPrice - price7d) / price7d) * 100,
        change30d: ((currentPrice - price30d) / price30d) * 100,
        volume24h: data[data.length - 1].volume || 0,
        floorPrice: Math.min(...data.map(d => d.price)),
        highestPrice: Math.max(...data.map(d => d.price))
      }
    } catch (error) {
      console.error('Error fetching NFT price history:', error)
      throw error
    }
  }

  // Get real-time NFT metadata using Helius
  static async getNFTMetadata(mint: string) {
    try {
      // Mock implementation - replace with actual Helius API call
      const response = await this.makeRequest('/token-metadata', {
        method: 'POST',
        body: JSON.stringify({
          mintAccounts: [mint],
          includeOffChain: true,
          disableCache: false,
        }),
      })

      return response[0] // Return first NFT metadata
    } catch (error) {
      console.error('Error fetching NFT metadata:', error)
      // Return mock data for demo
      return {
        mint,
        name: 'Mock NFT',
        symbol: 'MNFT',
        uri: '',
        sellerFeeBasisPoints: 500,
        creators: [],
        collection: null,
        uses: null,
      }
    }
  }

  // Get NFT collection stats
  static async getCollectionStats(_collectionAddress: string) {
    try {
      // Mock implementation - replace with actual Helius API call
      return {
        totalItems: 1000 + Math.floor(Math.random() * 5000),
        floorPrice: 0.5 + Math.random() * 2,
        totalVolume: 10000 + Math.random() * 50000,
        owners: 500 + Math.floor(Math.random() * 1000),
        listedCount: 50 + Math.floor(Math.random() * 200),
      }
    } catch (error) {
      console.error('Error fetching collection stats:', error)
      throw error
    }
  }

  // Get recent NFT sales
  static async getRecentSales(mint: string, limit: number = 10) {
    try {
      // Mock implementation - replace with actual Helius API call
      const sales = []
      for (let i = 0; i < limit; i++) {
        sales.push({
          id: `sale_${Date.now()}_${i}`,
          mint,
          price: 0.5 + Math.random() * 2,
          buyer: `buyer_${Math.random().toString(36).substring(7)}`,
          seller: `seller_${Math.random().toString(36).substring(7)}`,
          timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
          transactionSignature: `tx_${Math.random().toString(36).substring(7)}`,
        })
      }
      return sales
    } catch (error) {
      console.error('Error fetching recent sales:', error)
      throw error
    }
  }
}

// Helper function to format price data for Chart.js
export const formatPriceDataForChart = (priceHistory: NFTPriceHistory) => {
  return {
    labels: priceHistory.data.map(point => 
      new Date(point.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: 'Price (SOL)',
        data: priceHistory.data.map(point => point.price),
        borderColor: '#8b5cf6', // Purple color matching theme
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }
    ]
  }
}

// Helper function to get price change color
export const getPriceChangeColor = (change: number) => {
  if (change > 0) return 'text-green-400'
  if (change < 0) return 'text-red-400'
  return 'text-gray-400'
}

// Helper function to format price change
export const formatPriceChange = (change: number) => {
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
} 