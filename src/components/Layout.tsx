import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '../contexts/WalletContext'
import { 
  Store, 
  Image, 
  Plus, 
  Menu, 
  X,
  ExternalLink,
  Search,
  Wallet,
  Bell,
  Copy,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import toast from 'react-hot-toast'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const { connected, publicKey, wallet, disconnect } = useWallet()
  const location = useLocation()
  const navigate = useNavigate()
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'My NFTs', href: '/my-nfts', icon: Image },
    // Only show Create Listing when wallet is connected
    ...(connected ? [{ name: 'Create Listing', href: '/create-listing', icon: Plus }] : []),
  ]

  const isActive = (href: string) => location.pathname === href

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!connected || !publicKey) {
      setWalletBalance(null)
      return
    }

    setIsLoadingBalance(true)
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
      const balance = await connection.getBalance(new PublicKey(publicKey))
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
  }, [connected, publicKey])

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
        await navigator.clipboard.writeText(publicKey)
        console.log('Wallet address copied:', publicKey)
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
    console.log('Wallet state:', { connected, publicKey: publicKey?.slice(0, 10) + '...', walletDropdownOpen })
  }, [connected, publicKey, walletDropdownOpen])

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800/95 backdrop-blur-sm border-b border-dark-700 fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <img src="/Cookery-svg.svg" alt="Cookery" className="h-8 w-auto" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary-500 text-white'
                          : 'text-dark-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search collections on Cookery"
                  className="w-full pl-10 pr-16 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-dark-400">
                  Ctrl K
                </div>
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="p-2 text-dark-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* Wallet Balance - Only show when connected */}
              {connected && (
                <div className="hidden md:block text-sm text-white">
                  Balance:
                  {isLoadingBalance ? (
                    <span className="text-primary-400 font-semibold ml-1">
                      <div className="inline-block w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    <span className="text-primary-400 font-semibold ml-1">
                      {walletBalance !== null ? walletBalance.toFixed(4) : '0.00'} SOL
                    </span>
                  )}
                </div>
              )}

              {/* Wallet Info - Only show when connected */}
              {connected && (
                <div className="hidden lg:flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-xs text-white">
                    <div className="font-medium">
                      {wallet?.adapter?.name || 'Wallet'}
                    </div>
                    <div className="text-dark-400">
                      {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Not connected'}
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Button with Dropdown */}
              <div className="relative wallet-dropdown">
                {/* Debug indicator */}
                {walletDropdownOpen && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full z-[10000]"></div>
                )}
                {connected ? (
                  <button
                    onClick={() => {
                      console.log('Wallet button clicked, current state:', walletDropdownOpen)
                      setWalletDropdownOpen(!walletDropdownOpen)
                    }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 flex items-center space-x-2"
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
                ) : (
                  <WalletMultiButton className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800" />
                )}

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
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700 bg-dark-900/95 backdrop-blur-sm">
            <div className="px-4 py-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search collections on Cookery"
                  className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Mobile Wallet Info */}
              {connected && (
                <div className="mb-4 p-3 bg-dark-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {wallet?.adapter?.name || 'Wallet'}
                      </div>
                      <div className="text-dark-400 text-xs">
                        {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-white mb-3">
                    Balance: 
                    {isLoadingBalance ? (
                      <span className="text-indigo-400 font-semibold ml-1">
                        <div className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      </span>
                                                    ) : (
                                  <span className="text-indigo-400 font-semibold ml-1">
                                    {walletBalance !== null ? walletBalance.toFixed(4) : '0.00'} SOL
                                  </span>
                                )}
                  </div>
                  
                  {/* Mobile Wallet Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={copyWalletAddress}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-white transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Mobile Navigation Links */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-purple-400 bg-purple-600/20'
                          : 'text-dark-300 hover:text-white hover:bg-dark-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Adjusted for fixed header */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-900/80 backdrop-blur-sm border-t border-dark-700 mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link to="/marketplace" className="flex items-center space-x-2 mb-4">
                <img src="/Cookery-svg.svg" alt="Cookery" className="h-8 w-auto" />
              </Link>
              <p className="text-dark-400 max-w-md">
                A decentralized NFT marketplace built on Solana blockchain. 
                Trade, collect, and discover unique digital assets with zero fees and instant transactions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/marketplace" className="text-dark-400 hover:text-indigo-400 transition-colors duration-200">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/my-nfts" className="text-dark-400 hover:text-indigo-400 transition-colors duration-200">
                    My NFTs
                  </Link>
                </li>
                <li>
                  <Link to="/create-listing" className="text-dark-400 hover:text-indigo-400 transition-colors duration-200">
                    Create Listing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>Solana</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://book.anchor-lang.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>Anchor Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-700">
            <p className="text-center text-dark-500 text-sm">
              © 2024 Cookery. Built with ❤️ on Solana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 