import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, length: number = 8): string {
  if (!address) return ''
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} SOL`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function generateMockNFTs(count: number) {
  const mockImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  ]

  const mockNames = [
    'Cosmic Explorer',
    'Digital Art Masterpiece',
    'Pixel Warrior',
    'Abstract Dreams',
    'Neon City',
    'Mystic Forest',
    'Ocean Depths',
    'Desert Mirage',
  ]

  return Array.from({ length: count }, (_, i) => ({
    mint: `mock-mint-${i + 1}`,
    name: `${mockNames[i % mockNames.length]} #${String(i + 1).padStart(3, '0')}`,
    symbol: 'NFT',
    uri: `https://example.com/metadata/${i + 1}`,
    seller: 'mock-seller',
    price: Math.random() * 5 + 0.1,
    image: mockImages[i % mockImages.length],
    description: `A unique digital asset with special properties and rare attributes.`,
    attributes: [
      { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] },
      { trait_type: 'Background', value: ['Nebula', 'Abstract', 'Pixel', 'Neon'][Math.floor(Math.random() * 4)] },
    ],
  }))
} 