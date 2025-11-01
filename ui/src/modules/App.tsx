import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from '../state/UserContext';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ShopsPage } from '../pages/ShopsPage';
import { ShopDetailPage } from '../pages/ShopDetailPage';
import { VendorDashboard } from '../pages/VendorDashboard';
import { OrderReceivedPage } from '../pages/OrderReceivedPage';

export const App: React.FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/shops/:id" element={<ShopDetailPage />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/orders-received" element={<OrderReceivedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
};



