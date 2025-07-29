// High-quality NFT image URLs for different categories
export const nftImages = {
  // Cyber/Futuristic NFTs
  cyber: [
    "/cyber-falcon.jpg",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
  ],
  
  // Cosmic/Space themed NFTs
  cosmic: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop"
  ],
  
  // Digital Art/Abstract NFTs
  digital: [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=400&fit=crop"
  ],
  
  // Cyberpunk/Futuristic NFTs
  cyberpunk: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
  ],
  
  // Nature/Organic NFTs
  nature: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
  ],
  
  // Geometric/Abstract NFTs
  geometric: [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=400&fit=crop"
  ],
  
  // Fantasy/Mythical NFTs
  fantasy: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop"
  ]
}

// Function to get a random image from a specific category
export const getRandomNFTImage = (category: keyof typeof nftImages = 'digital') => {
  const images = nftImages[category]
  return images[Math.floor(Math.random() * images.length)]
}

// Function to get a random image from any category
export const getRandomImage = () => {
  const categories = Object.keys(nftImages) as (keyof typeof nftImages)[]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  return getRandomNFTImage(randomCategory)
}

// Function to get multiple unique images
export const getMultipleNFTImages = (count: number, category?: keyof typeof nftImages) => {
  const images: string[] = []
  const allImages = category ? nftImages[category] : Object.values(nftImages).flat()
  
  for (let i = 0; i < count; i++) {
    const randomImage = allImages[Math.floor(Math.random() * allImages.length)]
    if (!images.includes(randomImage)) {
      images.push(randomImage)
    } else {
      // If duplicate, try again
      i--
    }
  }
  
  return images
} 