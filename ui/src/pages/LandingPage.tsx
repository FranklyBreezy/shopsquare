import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, Grid, Flex } from '../components/Layout';
import { Button, Card } from '../components/UI';
import { api, Product, Shop } from '../services/apiClient';

export const LandingPage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        const [products, shops] = await Promise.all([
          api.products.getAll(),
          api.shops.getAll()
        ]);
        
        // Get first 6 products and 4 shops for featured sections
        setFeaturedProducts(products.slice(0, 6));
        setFeaturedShops(shops.slice(0, 4));
      } catch (error) {
        console.error('Error loading featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <Section background="gradient" padding="xl" className="hero-section">
        <Container size="lg">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="text-orange">ShopSquare</span>
              </h1>
              <h2 className="hero-subtitle">
                Multi-Vendor Marketplace
              </h2>
              <p className="hero-description">
                Discover amazing products from trusted vendors worldwide. 
                Shop with confidence in our secure, modern marketplace.
              </p>
              <div className="hero-actions">
                <Link to="/products">
                  <Button size="lg" className="hero-btn">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/shops">
                  <Button variant="secondary" size="lg">
                    Browse Vendors
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image">
                <div className="floating-card card-1">
                  <div className="card-icon">🛍️</div>
                  <span>Shop</span>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">🚚</div>
                  <span>Deliver</span>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">💳</div>
                  <span>Pay</span>
                </div>
                <div className="floating-card card-4">
                  <div className="card-icon">⭐</div>
                  <span>Review</span>
                </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>

    {/* Featured Products Section */}
    <Section padding="xl">
      <Container size="lg">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Discover trending products from our top vendors
          </p>
        </div>
        
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="product-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-button"></div>
              </Card>
            ))}
          </div>
        ) : (
          <Grid cols={3} gap="lg" className="products-grid">
            {featuredProducts.map((product) => (
              <Card key={product.id} hover className="product-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">
                      <span>📦</span>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <span className="product-stock">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <Button className="product-btn" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </Grid>
        )}
        
        <div className="section-footer">
          <Link to="/products">
            <Button variant="secondary">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </Section>

    {/* Featured Shops Section */}
    <Section background="dark" padding="xl">
      <Container size="lg">
        <div className="section-header">
          <h2 className="section-title">Featured Vendors</h2>
          <p className="section-subtitle">
            Shop from our trusted vendor partners
          </p>
        </div>
        
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shop-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </Card>
            ))}
          </div>
        ) : (
          <Grid cols={4} gap="lg" className="shops-grid">
            {featuredShops.map((shop) => (
              <Card key={shop.id} hover className="shop-card">
                <div className="shop-logo">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} />
                  ) : (
                    <div className="placeholder-logo">
                      <span>{shop.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="shop-info">
                  <h3 className="shop-name">{shop.name}</h3>
                  <p className="shop-description">{shop.description}</p>
                  <div className="shop-location">
                    <span>📍 {shop.city}, {shop.state}</span>
                  </div>
                  <Link to={`/shops/${shop.id}`}>
                    <Button variant="secondary" size="sm" className="shop-btn">
                      Visit Shop
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </Grid>
        )}
        
        <div className="section-footer">
          <Link to="/shops">
            <Button variant="secondary">
              View All Vendors
            </Button>
          </Link>
        </div>
      </Container>
    </Section>

    {/* CTA Section */}
    <Section background="gradient" padding="xl">
      <Container size="md">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Shopping?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers and discover amazing products today.
          </p>
          <div className="cta-actions">
            <Link to="/register">
              <Button size="lg" className="cta-btn">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>

    <style jsx>{`
      .landing-page {
        min-height: 100vh;
      }

      /* Hero Section */
      .hero-section {
        position: relative;
        overflow: hidden;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-3xl);
        align-items: center;
        min-height: 70vh;
      }

      .hero-title {
        font-size: var(--font-size-4xl);
        font-weight: 700;
        margin-bottom: var(--spacing-md);
        line-height: 1.1;
      }

      .hero-subtitle {
        font-size: var(--font-size-xl);
        color: var(--subtext-gray);
        margin-bottom: var(--spacing-lg);
        font-weight: 400;
      }

      .hero-description {
        font-size: var(--font-size-lg);
        color: var(--text-white);
        margin-bottom: var(--spacing-xl);
        line-height: 1.6;
      }

      .hero-actions {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
      }

      .hero-btn {
        box-shadow: var(--shadow-glow);
      }

      .hero-visual {
        position: relative;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hero-image {
        position: relative;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 61, 0, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .floating-card {
        position: absolute;
        background-color: var(--button-bg);
        border: 1px solid var(--border-gray);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs);
        animation: float 3s ease-in-out infinite;
        box-shadow: var(--shadow-md);
      }

      .floating-card:nth-child(1) {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .floating-card:nth-child(2) {
        top: 10%;
        right: 20%;
        animation-delay: 0.5s;
      }

      .floating-card:nth-child(3) {
        bottom: 20%;
        left: 20%;
        animation-delay: 1s;
      }

      .floating-card:nth-child(4) {
        bottom: 10%;
        right: 10%;
        animation-delay: 1.5s;
      }

      .card-icon {
        font-size: var(--font-size-xl);
      }

      .floating-card span {
        font-size: var(--font-size-sm);
        color: var(--text-white);
        font-weight: 500;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      /* Section Styles */
      .section-header {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
      }

      .section-title {
        font-size: var(--font-size-3xl);
        font-weight: 600;
        margin-bottom: var(--spacing-md);
      }

      .section-subtitle {
        font-size: var(--font-size-lg);
        color: var(--subtext-gray);
        max-width: 600px;
        margin: 0 auto;
      }

      .section-footer {
        text-align: center;
        margin-top: var(--spacing-xl);
      }

      /* Product Cards */
      .product-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .product-image {
        width: 100%;
        height: 200px;
        margin-bottom: var(--spacing-md);
        border-radius: var(--radius-md);
        overflow: hidden;
        background-color: var(--hover-bg);
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-3xl);
        color: var(--subtext-gray);
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .product-name {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--text-white);
      }

      .product-description {
        color: var(--subtext-gray);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-md);
        flex: 1;
      }

      .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }

      .product-price {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--primary-orange);
      }

      .product-stock {
        font-size: var(--font-size-xs);
        color: var(--subtext-gray);
      }

      .product-btn {
        width: 100%;
      }

      /* Shop Cards */
      .shop-card {
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .shop-logo {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--spacing-md);
        border-radius: 50%;
        overflow: hidden;
        background-color: var(--hover-bg);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .shop-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-logo {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-2xl);
        font-weight: 600;
        color: var(--primary-orange);
        background-color: var(--hover-bg);
      }

      .shop-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .shop-name {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--text-white);
      }

      .shop-description {
        color: var(--subtext-gray);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-md);
        flex: 1;
      }

      .shop-location {
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-xs);
        color: var(--subtext-gray);
      }

      .shop-btn {
        width: 100%;
      }

      /* CTA Section */
      .cta-content {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }

      .cta-title {
        font-size: var(--font-size-3xl);
        font-weight: 600;
        margin-bottom: var(--spacing-md);
      }

      .cta-description {
        font-size: var(--font-size-lg);
        color: var(--subtext-gray);
        margin-bottom: var(--spacing-xl);
      }

      .cta-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        flex-wrap: wrap;
      }

      .cta-btn {
        box-shadow: var(--shadow-glow);
      }

      /* Loading States */
      .loading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
      }

      .product-card-skeleton,
      .shop-card-skeleton {
        height: 300px;
      }

      .skeleton-image {
        width: 100%;
        height: 200px;
        background: linear-gradient(90deg, var(--hover-bg) 25%, var(--border-gray) 50%, var(--hover-bg) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
      }

      .skeleton-text {
        height: 16px;
        background: linear-gradient(90deg, var(--hover-bg) 25%, var(--border-gray) 50%, var(--hover-bg) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: var(--radius-sm);
        margin-bottom: var(--spacing-sm);
      }

      .skeleton-text.short {
        width: 60%;
      }

      .skeleton-button {
        height: 32px;
        background: linear-gradient(90deg, var(--hover-bg) 25%, var(--border-gray) 50%, var(--hover-bg) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: var(--radius-md);
        margin-top: auto;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .hero-content {
          grid-template-columns: 1fr;
          gap: var(--spacing-xl);
          text-align: center;
        }

        .hero-visual {
          height: 300px;
        }

        .hero-image {
          width: 250px;
          height: 250px;
        }
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: var(--font-size-3xl);
        }

        .hero-subtitle {
          font-size: var(--font-size-lg);
        }

        .hero-description {
          font-size: var(--font-size-base);
        }

        .hero-actions {
          flex-direction: column;
          align-items: center;
        }

        .hero-visual {
          height: 250px;
        }

        .hero-image {
          width: 200px;
          height: 200px;
        }

        .floating-card {
          padding: var(--spacing-sm);
        }

        .card-icon {
          font-size: var(--font-size-lg);
        }

        .section-title {
          font-size: var(--font-size-2xl);
        }

        .section-subtitle {
          font-size: var(--font-size-base);
        }

        .cta-title {
          font-size: var(--font-size-2xl);
        }

        .cta-description {
          font-size: var(--font-size-base);
        }

        .cta-actions {
          flex-direction: column;
          align-items: center;
        }
      }

      @media (max-width: 480px) {
        .hero-title {
          font-size: var(--font-size-2xl);
        }

        .hero-visual {
          height: 200px;
        }

        .hero-image {
          width: 150px;
          height: 150px;
        }

        .floating-card {
          padding: var(--spacing-xs);
        }

        .card-icon {
          font-size: var(--font-size-base);
        }

        .floating-card span {
          font-size: 0.7rem;
        }
      }
    `}</style>
  </div>
);
};
