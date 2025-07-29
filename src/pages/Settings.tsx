import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Wallet, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Copy,
  AlertCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../contexts/MarketplaceContext'
import toast from 'react-hot-toast'

const SettingsPage: React.FC = () => {
  console.log('SettingsPage component rendered')
  const { connected, publicKey, disconnect } = useWallet()
  const { updateMarketplaceFee } = useMarketplace()

  // Settings states
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    username: 'cookery_user',
    email: 'user@cookery.com',
    bio: 'NFT enthusiast and collector',
    avatar: '/api/placeholder/150/150'
  })

  // Wallet settings
  const [walletSettings, setWalletSettings] = useState({
    autoConnect: true,
    showBalance: true,
    confirmTransactions: true,
    network: 'mainnet-beta'
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newListings: true,
    priceChanges: true,
    offers: true,
    sales: true,
    marketing: false,
    email: true,
    push: true
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    showPrivateKeys: false
  })

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark',
    accentColor: 'purple',
    animations: true
  })

  // Marketplace settings
  const [marketplaceSettings, setMarketplaceSettings] = useState({
    defaultFee: 250, // Use default value instead of marketplaceData?.feeBps
    autoApproveOffers: false,
    showAnalytics: true
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'marketplace', name: 'Marketplace', icon: Settings }
  ]

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (section === 'marketplace') {
        await updateMarketplaceFee(marketplaceSettings.defaultFee)
      }
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyWalletAddress = async () => {
    if (!publicKey) {
      toast.error('No wallet connected')
      return
    }
    
    try {
      await navigator.clipboard.writeText(publicKey)
      toast.success('Wallet address copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy wallet address')
    }
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img 
          src={profileSettings.avatar} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border-2 border-primary-500"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{profileSettings.username}</h3>
          <p className="text-dark-400">Member since 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Username</label>
          <input
            type="text"
            value={profileSettings.username}
            onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            value={profileSettings.email}
            onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Bio</label>
        <textarea
          value={profileSettings.bio}
          onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
          rows={3}
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderWalletSettings = () => (
    <div className="space-y-6">
      {connected ? (
        <>
          <div className="bg-dark-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Connected Wallet</h4>
                <p className="text-dark-400 text-sm">{publicKey}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyWalletAddress}
                  className="p-2 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={disconnect}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Auto-connect wallet</h4>
                <p className="text-dark-400 text-sm">Automatically connect wallet when visiting the site</p>
              </div>
              <button
                onClick={() => setWalletSettings({...walletSettings, autoConnect: !walletSettings.autoConnect})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  walletSettings.autoConnect ? 'bg-primary-500' : 'bg-dark-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  walletSettings.autoConnect ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Show balance</h4>
                <p className="text-dark-400 text-sm">Display wallet balance in the header</p>
              </div>
              <button
                onClick={() => setWalletSettings({...walletSettings, showBalance: !walletSettings.showBalance})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  walletSettings.showBalance ? 'bg-primary-500' : 'bg-dark-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  walletSettings.showBalance ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Confirm transactions</h4>
                <p className="text-dark-400 text-sm">Always ask for confirmation before transactions</p>
              </div>
              <button
                onClick={() => setWalletSettings({...walletSettings, confirmTransactions: !walletSettings.confirmTransactions})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  walletSettings.confirmTransactions ? 'bg-primary-500' : 'bg-dark-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  walletSettings.confirmTransactions ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-dark-400">Connect your wallet to manage wallet settings.</p>
        </div>
      )}
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Notification Preferences</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">New Listings</h5>
              <p className="text-dark-400 text-sm">Get notified when new NFTs are listed</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, newListings: !notificationSettings.newListings})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.newListings ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.newListings ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Price Changes</h5>
              <p className="text-dark-400 text-sm">Get notified when prices change on your favorites</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, priceChanges: !notificationSettings.priceChanges})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.priceChanges ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.priceChanges ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Offers</h5>
              <p className="text-dark-400 text-sm">Get notified when you receive offers</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, offers: !notificationSettings.offers})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.offers ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.offers ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Sales</h5>
              <p className="text-dark-400 text-sm">Get notified when your NFTs are sold</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, sales: !notificationSettings.sales})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.sales ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.sales ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Delivery Methods</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Email Notifications</h5>
              <p className="text-dark-400 text-sm">Receive notifications via email</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, email: !notificationSettings.email})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.email ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-medium">Push Notifications</h5>
              <p className="text-dark-400 text-sm">Receive browser push notifications</p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, push: !notificationSettings.push})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.push ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Two-Factor Authentication</h4>
            <p className="text-dark-400 text-sm">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
            className={`w-12 h-6 rounded-full transition-colors ${
              securitySettings.twoFactorAuth ? 'bg-primary-500' : 'bg-dark-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Session Timeout (minutes)</label>
          <select
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={0}>Never</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Show Private Keys</h4>
            <p className="text-dark-400 text-sm">Display private keys in wallet settings (not recommended)</p>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, showPrivateKeys: !securitySettings.showPrivateKeys})}
            className={`w-12 h-6 rounded-full transition-colors ${
              securitySettings.showPrivateKeys ? 'bg-red-500' : 'bg-dark-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              securitySettings.showPrivateKeys ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-medium">Security Tips</h4>
            <ul className="text-yellow-300 text-sm mt-2 space-y-1">
              <li>• Never share your private keys with anyone</li>
              <li>• Use a hardware wallet for large amounts</li>
              <li>• Enable two-factor authentication</li>
              <li>• Regularly review your connected applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', name: 'Light', icon: Sun },
              { id: 'dark', name: 'Dark', icon: Moon },
              { id: 'auto', name: 'Auto', icon: Monitor }
            ].map((theme) => {
              const Icon = theme.icon
              return (
                <button
                  key={theme.id}
                  onClick={() => setThemeSettings({...themeSettings, theme: theme.id})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    themeSettings.theme === theme.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    themeSettings.theme === theme.id ? 'text-primary-400' : 'text-dark-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    themeSettings.theme === theme.id ? 'text-primary-400' : 'text-dark-300'
                  }`}>
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">Accent Color</label>
          <div className="grid grid-cols-6 gap-3">
            {['purple', 'blue', 'green', 'red', 'yellow', 'pink'].map((color) => (
              <button
                key={color}
                onClick={() => setThemeSettings({...themeSettings, accentColor: color})}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  themeSettings.accentColor === color
                    ? 'border-white scale-110'
                    : 'border-dark-600 hover:border-dark-500'
                }`}
                style={{ backgroundColor: getColorValue(color) }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Animations</h4>
            <p className="text-dark-400 text-sm">Enable smooth animations and transitions</p>
          </div>
          <button
            onClick={() => setThemeSettings({...themeSettings, animations: !themeSettings.animations})}
            className={`w-12 h-6 rounded-full transition-colors ${
              themeSettings.animations ? 'bg-primary-500' : 'bg-dark-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              themeSettings.animations ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderMarketplaceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Default Marketplace Fee (basis points)</label>
          <input
            type="number"
            value={marketplaceSettings.defaultFee}
            onChange={(e) => setMarketplaceSettings({...marketplaceSettings, defaultFee: parseInt(e.target.value)})}
            min="0"
            max="1000"
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-dark-400 text-sm mt-1">
            Current fee: {(marketplaceSettings.defaultFee / 100).toFixed(2)}%
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Auto-approve Offers</h4>
            <p className="text-dark-400 text-sm">Automatically accept offers above a certain threshold</p>
          </div>
          <button
            onClick={() => setMarketplaceSettings({...marketplaceSettings, autoApproveOffers: !marketplaceSettings.autoApproveOffers})}
            className={`w-12 h-6 rounded-full transition-colors ${
              marketplaceSettings.autoApproveOffers ? 'bg-primary-500' : 'bg-dark-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              marketplaceSettings.autoApproveOffers ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Show Analytics</h4>
            <p className="text-dark-400 text-sm">Display detailed analytics and insights</p>
          </div>
          <button
            onClick={() => setMarketplaceSettings({...marketplaceSettings, showAnalytics: !marketplaceSettings.showAnalytics})}
            className={`w-12 h-6 rounded-full transition-colors ${
              marketplaceSettings.showAnalytics ? 'bg-primary-500' : 'bg-dark-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              marketplaceSettings.showAnalytics ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  )

  const getColorValue = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: '#8b5cf6',
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#f59e0b',
      pink: '#ec4899'
    }
    return colors[color] || '#8b5cf6'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'wallet':
        return renderWalletSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'marketplace':
        return renderMarketplaceSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-dark-400">Manage your account preferences and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-4 border border-dark-700/30">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30"
            >
              {renderContent()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-dark-700/30">
                <button
                  onClick={() => handleSaveSettings(activeTab)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 