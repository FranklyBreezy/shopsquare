# ShopSquare - Multi-Vendor E-commerce Platform

A modern, futuristic e-commerce platform built with React and TypeScript, featuring a dark theme with orange accents and full responsiveness.

## Features

### 🎨 Modern UI/UX Design
- **Dark Theme**: Black background (#000000) with orange accents (#ff3d00)
- **Responsive Design**: Fully responsive across all devices
- **Modern Typography**: Inter font family for clean, readable text
- **Smooth Animations**: Hover effects, transitions, and loading states

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse and search products with filtering
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Place orders, track order status
- **User Profiles**: Manage personal information and addresses
- **Vendor Dashboard**: Product management for vendors

### 🔐 Authentication & Authorization
- **User Registration**: Sign up as customer or vendor
- **Login/Logout**: Secure authentication system
- **Role-based Access**: Different features for users vs vendors
- **Profile Management**: Update personal information

### 🏪 Multi-Vendor Support
- **Shop Management**: Vendors can manage their shops
- **Product Management**: Add, edit, delete products
- **Shop Discovery**: Browse different vendor shops
- **Vendor Dashboard**: Comprehensive management interface

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS-in-JS with styled-jsx
- **Routing**: React Router DOM
- **State Management**: React Context API
- **API Integration**: Fetch API with TypeScript types

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend microservices running (API Gateway on port 8080)

### Installation

1. **Install Dependencies**
   ```bash
   cd ui
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Layout.tsx      # Layout components
│   │   └── UI.tsx          # Basic UI components
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx # Home page
│   │   ├── ProductsPage.tsx# Product listing
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx    # Shopping cart
│   │   ├── OrdersPage.tsx  # Order history
│   │   ├── ProfilePage.tsx # User profile
│   │   ├── LoginPage.tsx   # Authentication
│   │   ├── RegisterPage.tsx
│   │   ├── ShopsPage.tsx   # Vendor shops
│   │   ├── ShopDetailPage.tsx
│   │   └── VendorDashboard.tsx
│   ├── services/           # API integration
│   │   └── apiClient.ts   # API client with types
│   ├── state/             # State management
│   │   └── UserContext.tsx# User context
│   ├── styles/            # Global styles
│   │   └── globals.css    # CSS variables and utilities
│   ├── modules/           # App configuration
│   │   └── App.tsx        # Main app component
│   └── main.tsx          # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API Integration

The frontend connects to microservices through the API Gateway:

- **User Service**: Authentication, user management
- **Profile Service**: User profile information
- **Shop Service**: Vendor shop management
- **Product Service**: Product catalog
- **Cart Service**: Shopping cart functionality
- **Order Service**: Order management

## Design System

### Color Palette
- **Primary Orange**: #ff3d00 (buttons, accents)
- **Subtext Gray**: #7e7e7e (secondary text)
- **Button Background**: #151515 (cards, buttons)
- **Page Background**: #000000 (main background)
- **Text White**: #f9f9f9 (primary text)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on mobile

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Hover effects, shadows, rounded corners
- **Inputs**: Focus states, validation styling
- **Modals**: Slide-up animations, backdrop blur

## Responsive Design

The application is fully responsive with breakpoints:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

Key responsive features:
- Mobile-first navigation with hamburger menu
- Responsive grid layouts
- Touch-friendly button sizes
- Optimized typography scaling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- CSS-in-JS for component styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ShopSquare microservices architecture.
