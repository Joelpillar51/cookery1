import React from 'react'

const TestPage: React.FC = () => {
  console.log('TestPage component rendered')
  
  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Test Page</h1>
        <p className="text-dark-400">This is a test page to verify routing is working.</p>
        <div className="mt-4 space-y-2">
          <a href="/settings" className="block text-primary-400 hover:text-primary-300">Go to Settings</a>
          <a href="/wallet" className="block text-primary-400 hover:text-primary-300">Go to Wallet</a>
          <a href="/dashboard" className="block text-primary-400 hover:text-primary-300">Go to Dashboard</a>
        </div>
      </div>
    </div>
  )
}

export default TestPage 