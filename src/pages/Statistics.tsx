import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Eye,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../contexts/MarketplaceContext'

const Statistics: React.FC = () => {
  const { connected } = useWallet()
  const { listings } = useMarketplace()
  const [timeRange, setTimeRange] = useState('7d')

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

  const topCollections = [
    { name: 'Pixel Falcons', volume: 2340.5, sales: 156, change: 23.4 },
    { name: 'Golden Falcons', volume: 1890.2, sales: 98, change: 18.7 },
    { name: 'Mad Lads', volume: 1567.8, sales: 87, change: -5.2 },
    { name: 'Abstract Falcons', volume: 1234.1, sales: 76, change: 12.3 },
    { name: 'Cyber Falcons', volume: 987.6, sales: 54, change: 8.9 }
  ]

  const recentActivity = [
    { type: 'sale', nft: 'Pixel Falcon #123', price: '45.2 SOL', time: '2 min ago' },
    { type: 'listing', nft: 'Golden Falcon #456', price: '32.1 SOL', time: '5 min ago' },
    { type: 'sale', nft: 'Mad Lad #789', price: '67.8 SOL', time: '8 min ago' },
    { type: 'listing', nft: 'Abstract Falcon #012', price: '23.4 SOL', time: '12 min ago' },
    { type: 'sale', nft: 'Cyber Falcon #345', price: '89.1 SOL', time: '15 min ago' }
  ]

  const timeRanges = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: '1y', label: '1Y' }
  ]

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-dark-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-dark-400">
          Connect your wallet to view statistics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistics</h1>
          <p className="text-dark-400">Marketplace analytics and insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
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

      {/* Top Collections & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Top Collections</h3>
          <div className="space-y-4">
            {topCollections.map((collection, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{collection.name}</p>
                    <p className="text-dark-400 text-sm">{collection.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{collection.volume} SOL</p>
                  <div className="flex items-center">
                    {collection.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <span className={`text-xs ${collection.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {collection.change > 0 ? '+' : ''}{collection.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'sale' ? 'bg-green-500/10' : 'bg-blue-500/10'
                  }`}>
                    {activity.type === 'sale' ? (
                      <ShoppingBag className="w-4 h-4 text-green-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.nft}</p>
                    <p className="text-dark-400 text-sm">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{activity.price}</p>
                  <p className="text-dark-400 text-xs capitalize">{activity.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Statistics 