import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'
import { MarketplaceProvider } from './contexts/MarketplaceContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import MyNFTs from './pages/MyNFTs'
import CreateListing from './pages/CreateListing'
import NFTDetail from './pages/NFTDetail'
import Profile from './pages/Profile'
import MarketplaceInit from './components/MarketplaceInit'
import MarketplaceSettings from './components/MarketplaceSettings'
import Statistics from './pages/Statistics'
import Favorites from './pages/Favorites'
import List from './pages/List'
import TestPage from './pages/TestPage'
import CodigoTemplate from './components/CodigoTemplate'

function App() {
  return (
    <WalletProvider>
      <MarketplaceProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              style: {
                background: '#059669',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                color: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Layout><Marketplace /></Layout>} />
          <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
          <Route path="/my-nfts" element={<Layout><MyNFTs /></Layout>} />
          <Route path="/create-listing" element={<Layout><CreateListing /></Layout>} />
          <Route path="/nft/:mint" element={<Layout><NFTDetail /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/marketplace/init" element={<MarketplaceInit />} />
          <Route path="/marketplace/settings" element={<Layout><MarketplaceSettings /></Layout>} />
          <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
          <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
          <Route path="/list" element={<Layout><List /></Layout>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/codigo-template" element={<CodigoTemplate />} />
        </Routes>
      </MarketplaceProvider>
    </WalletProvider>
  )
}

export default App 