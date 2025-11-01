import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, Grid } from '../components/Layout';
import { Button, Card, LoadingSpinner } from '../components/UI';
import { api, Shop } from '../services/apiClient';

export const ShopsPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const shopsData = await api.shops.getAll();
      setShops(shopsData);
    } catch (error) {
      console.error('Error loading shops:', error);
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
            <p>Loading shops...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (shops.length === 0) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="empty-shops">
            <Card className="empty-shops-card">
              <div className="empty-icon">🏪</div>
              <h2 className="empty-title">No shops available</h2>
              <p className="empty-message">
                There are currently no shops registered on our platform.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="shops-page">
          <div className="page-header">
            <h1 className="page-title">Vendor Shops</h1>
            <p className="page-subtitle">
              Discover amazing shops from our trusted vendors
            </p>
          </div>

          <Grid cols={3} gap="lg" className="shops-grid">
            {shops.map((shop) => (
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
                    <span className="location-icon">📍</span>
                    <span>{shop.city}, {shop.state}</span>
                  </div>
                  
                  <div className="shop-contact">
                    {shop.email && (
                      <div className="contact-item">
                        <span className="contact-icon">📧</span>
                        <span>{shop.email}</span>
                      </div>
                    )}
                    {shop.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <span>{shop.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="shop-status">
                    <span className={`status-badge ${shop.isActive ? 'active' : 'inactive'}`}>
                      {shop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="shop-actions">
                  <Link to={`/shops/${shop.id}`}>
                    <Button className="visit-btn">
                      Visit Shop
                    </Button>
                  </Link>
                  <Link to={`/products?shop=${shop.id}`}>
                    <Button variant="secondary" size="sm">
                      View Products
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      </Container>

      <style jsx>{`
        .shops-page {
          width: 100%;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          font-size: var(--font-size-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .page-subtitle {
          color: var(--subtext-gray);
          font-size: var(--font-size-lg);
        }

        .shop-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .shop-logo {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--spacing-lg);
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
          font-size: var(--font-size-3xl);
          font-weight: 600;
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .shop-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .shop-name {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .shop-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          line-height: 1.4;
          margin-bottom: var(--spacing-md);
        }

        .shop-location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .location-icon {
          font-size: var(--font-size-base);
        }

        .shop-contact {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .contact-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          color: var(--subtext-gray);
          font-size: var(--font-size-xs);
        }

        .contact-icon {
          font-size: var(--font-size-sm);
        }

        .shop-status {
          margin: var(--spacing-md) 0;
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

        .shop-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-lg);
        }

        .visit-btn {
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

        .empty-shops {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-shops-card {
          text-align: center;
          padding: var(--spacing-2xl);
          max-width: 400px;
        }

        .empty-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-lg);
        }

        .empty-title {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .empty-message {
          color: var(--subtext-gray);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .shop-logo {
            width: 100px;
            height: 100px;
          }

          .shop-name {
            font-size: var(--font-size-lg);
          }
        }

        @media (max-width: 480px) {
          .shop-logo {
            width: 80px;
            height: 80px;
          }

          .placeholder-logo {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </Section>
  );
};
