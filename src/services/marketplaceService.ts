import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import { IDL } from '../idl/anchor_nft_marketplace'

export interface MarketplaceData {
  authority: PublicKey
  feeBps: number
  marketplaceBump: number
  treasury: PublicKey
  treasuryBump: number
  name: string
}

export interface ListingData {
  maker: PublicKey
  nftMint: PublicKey
  price: BN
  metadata: PublicKey
  bump: number
}

export class MarketplaceService {
  private program: Program
  private marketplacePda: PublicKey
  private treasuryPda: PublicKey

  constructor(connection: Connection, wallet: any) {
    const provider = new AnchorProvider(connection, wallet, {})
    this.program = new Program(IDL as any, 'FvdEiEPJUEMUZ7HCkK2gPfYGFXCbUB68mTJufdC9BjC5', provider)
    
    // Derive PDAs
    const [marketplacePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('marketplace')],
      this.program.programId
    )
    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury')],
      this.program.programId
    )
    
    this.marketplacePda = marketplacePda
    this.treasuryPda = treasuryPda
  }

  // Initialize marketplace
  async initializeMarketplace(name: string, feeBps: number, authority: PublicKey) {
    try {
      const tx = await this.program.methods
        .initializeMarketplace(name, feeBps)
        .accounts({
          marketplace: this.marketplacePda,
          treasury: this.treasuryPda,
          authority,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc()
      
      return tx
    } catch (error) {
      console.error('Error initializing marketplace:', error)
      throw error
    }
  }

  // List NFT
  async listNFT(
    nftMint: PublicKey,
    metadata: PublicKey,
    price: number,
    maker: PublicKey
  ) {
    try {
      const [listingPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), nftMint.toBuffer()],
        this.program.programId
      )

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), nftMint.toBuffer()],
        this.program.programId
      )

      const priceBN = new BN(price * 1e9) // Convert to lamports

      const tx = await this.program.methods
        .listNft(priceBN)
        .accounts({
          listing: listingPda,
          vault: vaultPda,
          nftMint,
          metadata,
          maker,
          marketplace: this.marketplacePda,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc()
      
      return tx
    } catch (error) {
      console.error('Error listing NFT:', error)
      throw error
    }
  }

  // Purchase NFT
  async purchaseNFT(
    nftMint: PublicKey,
    buyer: PublicKey,
    _price: number
  ) {
    try {
      const [listingPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), nftMint.toBuffer()],
        this.program.programId
      )

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), nftMint.toBuffer()],
        this.program.programId
      )

      const tx = await this.program.methods
        .purchaseNft()
        .accounts({
          listing: listingPda,
          vault: vaultPda,
          nftMint,
          buyer,
          marketplace: this.marketplacePda,
          treasury: this.treasuryPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      
      return tx
    } catch (error) {
      console.error('Error purchasing NFT:', error)
      throw error
    }
  }

  // Delist NFT
  async delistNFT(
    nftMint: PublicKey,
    maker: PublicKey
  ) {
    try {
      const [listingPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), nftMint.toBuffer()],
        this.program.programId
      )

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), nftMint.toBuffer()],
        this.program.programId
      )

      const tx = await this.program.methods
        .delistNft()
        .accounts({
          listing: listingPda,
          vault: vaultPda,
          nftMint,
          maker,
          marketplace: this.marketplacePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      
      return tx
    } catch (error) {
      console.error('Error delisting NFT:', error)
      throw error
    }
  }

  // Update marketplace fee
  async updateFee(feeBps: number, authority: PublicKey) {
    try {
      const tx = await this.program.methods
        .updateFee(feeBps)
        .accounts({
          marketplace: this.marketplacePda,
          authority,
        })
        .rpc()
      
      return tx
    } catch (error) {
      console.error('Error updating fee:', error)
      throw error
    }
  }

  // Fetch marketplace data
  async getMarketplaceData(): Promise<MarketplaceData | null> {
    try {
      const marketplaceAccount = await this.program.account.marketplace.fetch(this.marketplacePda)
      return {
        authority: marketplaceAccount.authority as PublicKey,
        feeBps: marketplaceAccount.feeBps as number,
        marketplaceBump: marketplaceAccount.marketplaceBump as number,
        treasury: marketplaceAccount.treasury as PublicKey,
        treasuryBump: marketplaceAccount.treasuryBump as number,
        name: marketplaceAccount.name as string,
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error)
      return null
    }
  }

  // Fetch listing data
  async getListingData(nftMint: PublicKey): Promise<ListingData | null> {
    try {
      const [listingPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('listing'), nftMint.toBuffer()],
        this.program.programId
      )

      const listingAccount = await this.program.account.listing.fetch(listingPda)
      return {
        maker: listingAccount.maker as PublicKey,
        nftMint: listingAccount.nftMint as PublicKey,
        price: listingAccount.price as BN,
        metadata: listingAccount.metadata as PublicKey,
        bump: listingAccount.bump as number,
      }
    } catch (error) {
      console.error('Error fetching listing data:', error)
      return null
    }
  }

  // Fetch all listings
  async getAllListings(): Promise<ListingData[]> {
    try {
      const listings = await this.program.account.listing.all()
      return listings.map(account => ({
        maker: account.account.maker as PublicKey,
        nftMint: account.account.nftMint as PublicKey,
        price: account.account.price as BN,
        metadata: account.account.metadata as PublicKey,
        bump: account.account.bump as number,
      }))
    } catch (error) {
      console.error('Error fetching all listings:', error)
      return []
    }
  }

  // Check if marketplace is initialized
  async isMarketplaceInitialized(): Promise<boolean> {
    try {
      await this.program.account.marketplace.fetch(this.marketplacePda)
      return true
    } catch (error) {
      return false
    }
  }
} 