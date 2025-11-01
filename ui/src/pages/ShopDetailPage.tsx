import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section, Grid } from '../components/Layout';
import { Button, Card, LoadingSpinner } from '../components/UI';
import { api, Shop, Product } from '../services/apiClient';

export const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadShopData();
  }, [id]);

  const loadShopData = async () => {
    if (!id) return;
    
    try {
      const [shopData, productsData] = await Promise.all([
        api.shops.getById(parseInt(id)),
        api.products.getByShopId(parseInt(id))
      ]);
      
      setShop(shopData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading shop details...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!shop) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <Card className="error-state">
            <div className="error-icon">❌</div>
            <h3 className="error-title">Shop Not Found</h3>
            <p className="error-message">
              The shop you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shops">
              <Button>Back to Shops</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="shop-detail">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/shops" className="breadcrumb-link">Shops</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{shop.name}</span>
          </nav>

          {/* Shop Header */}
          <Card className="shop-header-card">
            <div className="shop-header">
              <div className="shop-logo-section">
                <div className="shop-logo">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} />
                  ) : (
                    <div className="placeholder-logo">
                      <span>{shop.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="shop-status">
                  <span className={`status-badge ${shop.isActive ? 'active' : 'inactive'}`}>
                    {shop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="shop-info">
                <h1 className="shop-name">{shop.name}</h1>
                <p className="shop-description">{shop.description}</p>
                
                <div className="shop-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{shop.address}, {shop.city}, {shop.state} {shop.zipCode}</span>
                  </div>
                  {shop.country && (
                    <div className="detail-item">
                      <span className="detail-icon">🌍</span>
                      <span>{shop.country}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="detail-item">
                      <span className="detail-icon">📞</span>
                      <span>{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="detail-item">
                      <span className="detail-icon">📧</span>
                      <span>{shop.email}</span>
                    </div>
                  )}
                  {shop.website && (
                    <div className="detail-item">
                      <span className="detail-icon">🌐</span>
                      <a href={shop.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        {shop.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Products Section */}
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">Products ({products.length})</h2>
              <p className="section-subtitle">
                Browse products from {shop.name}
              </p>
            </div>

            {products.length === 0 ? (
              <Card className="empty-products">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No products available</h3>
                <p className="empty-message">
                  This shop doesn't have any products listed yet.
                </p>
              </Card>
            ) : (
              <Grid cols={4} gap="lg" className="products-grid">
                {products.map((product) => (
                  <Card key={product.id} hover className="product-card">
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="placeholder-image">
                          <span>📦</span>
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="out-of-stock-badge">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">
                        <Link to={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-meta">
                        <div className="product-price">${product.price.toFixed(2)}</div>
                        <div className="product-stock">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>

                      <div className="product-category">
                        <span className="category-badge">{product.category}</span>
                      </div>
                    </div>

                    <div className="product-actions">
                      <Link to={`/products/${product.id}`}>
                        <Button variant="secondary" size="sm" className="view-btn">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </Grid>
            )}
          </div>
        </div>
      </Container>

      <style jsx>{`
        .shop-detail {
          width: 100%;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          font-size: var(--font-size-sm);
        }

        .breadcrumb-link {
          color: var(--primary-orange);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .breadcrumb-link:hover {
          color: #e63500;
        }

        .breadcrumb-separator {
          color: var(--subtext-gray);
        }

        .breadcrumb-current {
          color: var(--text-white);
        }

        .shop-header-card {
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .shop-header {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--spacing-xl);
          align-items: flex-start;
        }

        .shop-logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
        }

        .shop-logo {
          width: 150px;
          height: 150px;
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
          font-size: var(--font-size-4xl);
          font-weight: 600;
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.inactive {
          background-color: rgba(107, 114, 128, 0.2);
          color: #6b7280;
        }

        .shop-info {
          flex: 1;
        }

        .shop-name {
          font-size: var(--font-size-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .shop-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-lg);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
        }

        .shop-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .detail-icon {
          font-size: var(--font-size-base);
          width: 20px;
        }

        .website-link {
          color: var(--primary-orange);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .website-link:hover {
          color: #e63500;
        }

        .products-section {
          margin-top: var(--spacing-xl);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .section-subtitle {
          color: var(--subtext-gray);
          font-size: var(--font-size-lg);
        }

        .empty-products {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .empty-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-lg);
        }

        .empty-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .empty-message {
          color: var(--subtext-gray);
        }

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
          position: relative;
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

        .out-of-stock-badge {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          background-color: rgba(239, 68, 68, 0.9);
          color: white;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
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
          line-height: 1.3;
        }

        .product-name a {
          color: var(--text-white);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .product-name a:hover {
          color: var(--primary-orange);
        }

        .product-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
          flex: 1;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
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

        .product-category {
          margin-bottom: var(--spacing-md);
        }

        .category-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background-color: var(--hover-bg);
          color: var(--primary-orange);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-actions {
          margin-top: auto;
        }

        .view-btn {
          width: 100%;
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        .error-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .error-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-lg);
        }

        .error-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .error-message {
          color: var(--subtext-gray);
          margin-bottom: var(--spacing-lg);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .shop-header {
            grid-template-columns: 1fr;
            text-align: center;
            gap: var(--spacing-lg);
          }

          .shop-logo-section {
            flex-direction: row;
            justify-content: center;
            gap: var(--spacing-lg);
          }
        }

        @media (max-width: 768px) {
          .shop-name {
            font-size: var(--font-size-2xl);
          }

          .shop-description {
            font-size: var(--font-size-base);
          }

          .shop-logo {
            width: 120px;
            height: 120px;
          }

          .section-title {
            font-size: var(--font-size-xl);
          }

          .section-subtitle {
            font-size: var(--font-size-base);
          }
        }

        @media (max-width: 480px) {
          .shop-header-card {
            padding: var(--spacing-lg);
          }

          .shop-logo-section {
            flex-direction: column;
          }

          .shop-logo {
            width: 100px;
            height: 100px;
          }

          .placeholder-logo {
            font-size: var(--font-size-3xl);
          }

          .shop-name {
            font-size: var(--font-size-xl);
          }
        }
      `}</style>
    </Section>
  );
};
