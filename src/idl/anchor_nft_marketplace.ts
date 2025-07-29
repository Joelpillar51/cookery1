export const IDL = {
  "version": "0.1.0",
  "name": "anchor_nft_marketplace",
  "instructions": [
    {
      "name": "initializeMarketplace",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "fee",
          "type": "u16"
        }
      ]
    },
    {
      "name": "listNft",
      "accounts": [
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "maker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "marketplace",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "purchaseNft",
      "accounts": [
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "marketplace",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "delistNft",
      "accounts": [
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "maker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "marketplace",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateFee",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "updatedFee",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Marketplace",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "marketplaceBump",
            "type": "u8"
          },
          {
            "name": "treasury",
            "type": "publicKey"
          },
          {
            "name": "treasuryBump",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maker",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPrice",
      "msg": "Price must be greater than 0"
    },
    {
      "code": 6001,
      "name": "InvalidFee",
      "msg": "Fee must be between 0 and 10000 (0-100%)"
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for purchase"
    },
    {
      "code": 6003,
      "name": "NotAuthorized",
      "msg": "Not authorized to perform this action"
    },
    {
      "code": 6004,
      "name": "ListingNotFound",
      "msg": "Listing not found"
    },
    {
      "code": 6005,
      "name": "MarketplaceNotInitialized",
      "msg": "Marketplace not initialized"
    }
  ]
} 