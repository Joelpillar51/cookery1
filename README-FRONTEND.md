# 🎨 NFT Marketplace Frontend

A beautiful, production-ready React frontend for the Solana NFT Marketplace. Built with modern React practices, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 User Experience
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Beautiful animations and smooth interactions
- **Dark/Light Mode Ready** - Easy to implement theme switching
- **Loading States** - Professional loading indicators and skeleton screens
- **Error Handling** - User-friendly error messages and fallbacks

### 🔗 Wallet Integration
- **Multi-Wallet Support** - Phantom, Solflare, Backpack, and more
- **Auto-Connect** - Seamless wallet connection experience
- **Transaction Status** - Real-time transaction feedback
- **Network Switching** - Support for Devnet and Mainnet

### 🛍️ Marketplace Features
- **Browse NFTs** - Grid and list view with advanced filtering
- **Search & Filter** - Find NFTs by name, price range, and attributes
- **Create Listings** - Easy-to-use listing creation form
- **Purchase NFTs** - One-click purchase with SOL
- **Profile Management** - View stats, activity, and manage listings

### 🎨 Design System
- **Consistent Styling** - Tailwind CSS with custom design tokens
- **Component Library** - Reusable UI components
- **Animations** - Framer Motion for smooth transitions
- **Icons** - Lucide React for beautiful icons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Yarn or npm
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Install Dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Start Development Server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
yarn build
# or
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── contexts/           # React contexts for state management
│   ├── WalletContext.tsx    # Solana wallet integration
│   └── MarketplaceContext.tsx # Marketplace state and operations
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Marketplace.tsx # NFT browsing
│   ├── MyNFTs.tsx      # User's NFT collection
│   ├── CreateListing.tsx # Create new listing
│   ├── NFTDetail.tsx   # Individual NFT view
│   └── Profile.tsx     # User profile
├── utils/              # Utility functions
│   └── index.ts        # Common helpers
├── App.tsx             # Main app component
├── main.tsx           # React entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #1E40AF)
- **Secondary**: Gray scale (#F8FAFC to #0F172A)
- **Accent**: Purple gradient (#D946EF to #701A75)

### Typography
- **Font Family**: Inter (sans-serif)
- **Monospace**: JetBrains Mono

### Components
- **Buttons**: Primary, Secondary, Accent variants
- **Cards**: Consistent card styling with hover effects
- **Inputs**: Form inputs with focus states
- **Modals**: Wallet connection and transaction modals

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SOLANA_NETWORK=devnet
VITE_PROGRAM_ID=your_program_id_here
VITE_RPC_ENDPOINT=your_rpc_endpoint_here
```

### Tailwind Configuration
Custom colors, fonts, and animations are defined in `tailwind.config.js`.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations

Built with Framer Motion for smooth, performant animations:
- **Page Transitions**: Fade and slide effects
- **Hover Effects**: Scale and color transitions
- **Loading States**: Skeleton screens and spinners
- **Micro-interactions**: Button clicks and form interactions

## 🔒 Security Features

- **Wallet Validation** - Secure wallet connection
- **Transaction Signing** - Proper transaction handling
- **Input Sanitization** - Form validation and sanitization
- **Error Boundaries** - Graceful error handling

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test --coverage
```

## 📦 Build & Deploy

### Build
```bash
yarn build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 🔗 Integration with Backend

The frontend integrates with the Solana/Anchor backend through:

1. **Wallet Connection** - Uses Solana wallet adapters
2. **Program Calls** - Interacts with Anchor programs
3. **State Management** - React Query for server state
4. **Real-time Updates** - WebSocket connections for live data

## 🎯 Performance Optimizations

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Images and components
- **Memoization** - React.memo and useMemo
- **Bundle Optimization** - Tree shaking and minification

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure wallet extension is installed
   - Check network configuration
   - Verify wallet permissions

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify PostCSS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Solana](https://solana.com) - Blockchain platform
- [Anchor](https://book.anchor-lang.com) - Development framework
- [React](https://reactjs.org) - UI library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Framer Motion](https://framer.com/motion) - Animation library 