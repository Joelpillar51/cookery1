import React, { createContext, useContext, useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletContextType {
  connected: boolean
  publicKey: string | null
  publicKeyObject: any | null
  wallet: any
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Inner component that uses the Solana wallet adapter
const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, publicKey, wallet, connect: solanaConnect, disconnect: solanaDisconnect } = useSolanaWallet()

  const connect = async () => {
    try {
      await solanaConnect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await solanaDisconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const value = {
    connected,
    publicKey: publicKey?.toString() || null,
    publicKeyObject: publicKey,
    wallet,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  // Set up network and endpoint
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Set up wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
} 