import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../state/UserContext';

export const Header: React.FC = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-text">ShopSquare</span>
            <span className="logo-subtitle">Multi-Vendor Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            {user?.role === 'SELLER' ? (
              // Vendor Navigation
              <>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                >
                  Browse Products
                </Link>
                <Link 
                  to="/vendor-dashboard" 
                  className={`nav-link ${isActive('/vendor-dashboard') ? 'active' : ''}`}
                >
                  My Shop
                </Link>
                <Link 
                  to="/orders-received" 
                  className={`nav-link ${isActive('/orders-received') ? 'active' : ''}`}
                >
                  Orders Received
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            ) : user?.role === 'SELLER' ? (
              // Seller Navigation
              <>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                >
                  My Products
                </Link>
                <Link 
                  to="/vendor-dashboard" 
                  className={`nav-link ${isActive('/vendor-dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/orders-received" 
                  className={`nav-link ${isActive('/orders-received') ? 'active' : ''}`}
                >
                  Orders Received
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              // Customer Navigation
              <>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                >
                  Products
                </Link>
                <Link 
                  to="/shops" 
                  className={`nav-link ${isActive('/shops') ? 'active' : ''}`}
                >
                  Vendors
                </Link>
                <Link 
                  to="/cart" 
                  className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                >
                  My Cart
                </Link>
                <Link 
                  to="/orders" 
                  className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                >
                  My Orders
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hi, {user.name}</span>
                {user.role === 'SELLER' && (
                  <Link to="/vendor-dashboard" className="btn btn-sm btn-secondary">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-sm btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          {user?.role === 'SELLER' ? (
            // Vendor Mobile Navigation
            <>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Products
              </Link>
              <Link 
                to="/vendor-dashboard" 
                className={`nav-link ${isActive('/vendor-dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Shop
              </Link>
              <Link 
                to="/orders-received" 
                className={`nav-link ${isActive('/orders-received') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders Received
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          ) : (
            // Customer Mobile Navigation
            <>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/shops" 
                className={`nav-link ${isActive('/shops') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vendors
              </Link>
              <Link 
                to="/cart" 
                className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Cart
              </Link>
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
          
          {user ? (
            <div className="mobile-user-actions">
              {user.role === 'SELLER' && (
                <Link 
                  to="/vendor-dashboard" 
                  className="btn btn-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vendor Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link 
                to="/login" 
                className="btn btn-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          background-color: var(--button-bg);
          border-bottom: 1px solid var(--border-gray);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
        }

        .logo {
          text-decoration: none;
          color: var(--text-white);
        }

        .logo-text {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--primary-orange);
          display: block;
          line-height: 1;
        }

        .logo-subtitle {
          font-size: var(--font-size-xs);
          color: var(--subtext-gray);
          font-weight: 400;
        }

        .nav-desktop {
          display: flex;
          gap: var(--spacing-lg);
          align-items: center;
        }

        .nav-link {
          color: var(--text-white);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .nav-link.active {
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background-color: var(--primary-orange);
          border-radius: 1px;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .user-greeting {
          color: var(--text-white);
          font-weight: 500;
        }

        .auth-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          position: relative;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: var(--text-white);
          border-radius: 1px;
          transition: all var(--transition-normal);
          transform-origin: center;
        }

        .hamburger span:nth-child(1) {
          margin-bottom: 6px;
        }

        .hamburger span:nth-child(2) {
          margin-bottom: 6px;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg) 0;
          border-top: 1px solid var(--border-gray);
          background-color: var(--button-bg);
        }

        .nav-mobile.open {
          display: flex;
        }

        .mobile-user-actions,
        .mobile-auth-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-gray);
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .user-actions {
            display: none;
          }

          .logo-text {
            font-size: var(--font-size-xl);
          }

          .logo-subtitle {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: var(--spacing-sm) 0;
          }

          .logo-text {
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </header>
  );
};
