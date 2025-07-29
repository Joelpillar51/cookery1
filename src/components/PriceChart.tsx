import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { HeliusService, NFTPriceHistory, formatPriceDataForChart, getPriceChangeColor, formatPriceChange } from '../services/heliusService'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PriceChartProps {
  mint: string
  currentPrice: number
}

const PriceChart: React.FC<PriceChartProps> = ({ mint, currentPrice }) => {
  const [priceHistory, setPriceHistory] = useState<NFTPriceHistory | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7D' | '30D' | '90D'>('7D')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPriceHistory()
  }, [mint, selectedTimeframe])

  const fetchPriceHistory = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await HeliusService.getNFTPriceHistory(mint, selectedTimeframe, currentPrice)
      setPriceHistory(data)
    } catch (err) {
      setError('Failed to load price data')
      console.error('Error fetching price history:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return `Price: ${context[0].parsed.y.toFixed(4)} SOL`
          },
          label: (context: any) => {
            return `Date: ${context.label}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value.toFixed(2)} SOL`
        },
        border: {
          display: false,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 2,
      }
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  if (isLoading) {
    return (
      <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Price History</h3>
          <div className="flex space-x-2">
            {['7D', '30D', '90D'].map((timeframe) => (
              <button 
                key={timeframe}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-dark-700/50 text-dark-300"
                disabled
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 bg-dark-700/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-dark-400">Loading price data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !priceHistory) {
    return (
      <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Price History</h3>
        </div>
        
        <div className="h-64 bg-dark-700/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-dark-400">{error || 'No price data available'}</p>
            <button 
              onClick={fetchPriceHistory}
              className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const chartData = formatPriceDataForChart(priceHistory)

  // Add current listing price as a reference line
  const chartDataWithReference = {
    ...chartData,
    datasets: [
      ...chartData.datasets,
      {
        label: 'Current Listing Price',
        data: chartData.datasets[0]?.data.map(() => currentPrice) || [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0
      }
    ]
  }

  return (
    <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Price History</h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-dark-400">Current:</span>
              <span className="text-white font-semibold">{currentPrice.toFixed(4)} SOL</span>
            </div>
            <div className="flex items-center space-x-1">
              {getChangeIcon(priceHistory.change24h)}
              <span className={`text-sm font-medium ${getPriceChangeColor(priceHistory.change24h)}`}>
                {formatPriceChange(priceHistory.change24h)} (24h)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['7D', '30D', '90D'] as const).map((timeframe) => (
            <button 
              key={timeframe}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-dark-700/50 text-dark-300 hover:bg-dark-600/50'
              }`}
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-700/30 rounded-lg p-3">
          <div className="text-sm text-dark-400">Floor Price</div>
          <div className="text-white font-semibold">{priceHistory.floorPrice.toFixed(4)} SOL</div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3">
          <div className="text-sm text-dark-400">Highest Price</div>
          <div className="text-white font-semibold">{priceHistory.highestPrice.toFixed(4)} SOL</div>
        </div>
        <div className="bg-dark-700/30 rounded-lg p-3">
          <div className="text-sm text-dark-400">24h Volume</div>
          <div className="text-white font-semibold">{priceHistory.volume24h.toFixed(2)} SOL</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 bg-dark-700/30 rounded-xl p-4">
        <Line data={chartDataWithReference} options={chartOptions} />
      </div>
      
      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-primary-400"></div>
          <span className="text-dark-300">Market Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-amber-400 border-dashed border-amber-400"></div>
          <span className="text-dark-300">Listing Price</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center justify-between p-3 bg-dark-700/20 rounded-lg">
          <span className="text-sm text-dark-400">7D Change</span>
          <div className="flex items-center space-x-1">
            {getChangeIcon(priceHistory.change7d)}
            <span className={`text-sm font-medium ${getPriceChangeColor(priceHistory.change7d)}`}>
              {formatPriceChange(priceHistory.change7d)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-dark-700/20 rounded-lg">
          <span className="text-sm text-dark-400">30D Change</span>
          <div className="flex items-center space-x-1">
            {getChangeIcon(priceHistory.change30d)}
            <span className={`text-sm font-medium ${getPriceChangeColor(priceHistory.change30d)}`}>
              {formatPriceChange(priceHistory.change30d)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceChart 