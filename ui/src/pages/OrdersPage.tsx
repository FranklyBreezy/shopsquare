import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, Grid } from '../components/Layout';
import { Button, Card, LoadingSpinner } from '../components/UI';
import { api, Order, OrderItem, Product, formatCurrencyINR } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const userOrders = await api.orders.getByUserId(user.id);
      setOrders(userOrders);
      
      // Load order items and products
      const itemsMap: Record<number, OrderItem[]> = {};
      const productIds = new Set<number>();
      
      for (const order of userOrders) {
        const items = await api.orderItems.getByOrderId(order.id);
        itemsMap[order.id] = items;
        items.forEach(item => productIds.add(item.productId));
      }
      
      setOrderItems(itemsMap);
      
      // Load products
      const productPromises = Array.from(productIds).map(id => api.products.getById(id));
      const productData = await Promise.all(productPromises);
      
      const productsMap = productData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<number, Product>);
      
      setProducts(productsMap);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'CONFIRMED': return '#3b82f6';
      case 'SHIPPED': return '#8b5cf6';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      case 'REFUNDED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading your orders...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (orders.length === 0) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="empty-orders">
            <Card className="empty-orders-card">
              <div className="empty-icon">📦</div>
              <h2 className="empty-title">No orders yet</h2>
              <p className="empty-message">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link to="/products">
                <Button size="lg" className="shop-btn">
                  Start Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="orders-page">
          <div className="page-header">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">
              Track and manage your orders
            </p>
          </div>

          <div className="orders-list">
            {orders.map((order) => {
              const items = orderItems[order.id] || [];
              const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <Card key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-id">Order #{order.id}</h3>
                      <p className="order-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                        {order.status}
                      </div>
                      <div className="payment-status" style={{ color: getPaymentStatusColor(order.paymentStatus) }}>
                        Payment: {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items ({totalItems})</h4>
                    <div className="items-list">
                      {items.map((item) => {
                        const product = products[item.productId];
                        if (!product) return null;

                        return (
                          <div key={item.id} className="order-item">
                            <div className="item-image">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} />
                              ) : (
                                <div className="placeholder-image">
                                  <span>📦</span>
                                </div>
                              )}
                            </div>
                            <div className="item-details">
                              <h5 className="item-name">
                                <Link to={`/products/${product.id}`}>
                                  {product.name}
                                </Link>
                              </h5>
                              <p className="item-quantity">Quantity: {item.quantity}</p>
                              <p className="item-price">{formatCurrencyINR(item.price)} each</p>
                            </div>
                            <div className="item-total">
                              {formatCurrencyINR(item.price * item.quantity)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="shipping-info">
                      <h4>Shipping Address</h4>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div className="order-total">
                      <div className="total-amount">
                        Total: {formatCurrencyINR(order.totalAmount)}
                      </div>
                      <div className="order-actions">
                        <Button variant="secondary" size="sm">
                          Track Order
                        </Button>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>

      <style jsx>{`
        .orders-page {
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

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .order-card {
          padding: var(--spacing-lg);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-gray);
        }

        .order-id {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-white);
        }

        .order-date {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .order-status {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          color: white;
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-xs);
        }

        .payment-status {
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .order-items {
          margin-bottom: var(--spacing-lg);
        }

        .order-items h4 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .order-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: var(--spacing-md);
          align-items: center;
          padding: var(--spacing-md);
          background-color: var(--hover-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-gray);
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--button-bg);
        }

        .item-image img {
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
          font-size: var(--font-size-xl);
          color: var(--subtext-gray);
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: var(--font-size-base);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .item-name a {
          color: var(--text-white);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .item-name a:hover {
          color: var(--primary-orange);
        }

        .item-quantity,
        .item-price {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-xs);
        }

        .item-total {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--primary-orange);
          text-align: right;
        }

        .order-summary {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--spacing-lg);
          align-items: flex-start;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-gray);
        }

        .shipping-info h4 {
          font-size: var(--font-size-base);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .shipping-info p {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          line-height: 1.4;
        }

        .order-total {
          text-align: right;
        }

        .total-amount {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--primary-orange);
          margin-bottom: var(--spacing-md);
        }

        .order-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        .empty-orders {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-orders-card {
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
          margin-bottom: var(--spacing-lg);
        }

        .shop-btn {
          box-shadow: var(--shadow-glow);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .order-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }

          .order-status {
            text-align: left;
          }

          .order-item {
            grid-template-columns: 60px 1fr;
            gap: var(--spacing-sm);
          }

          .item-total {
            grid-column: 1 / -1;
            text-align: left;
            margin-top: var(--spacing-sm);
            padding-top: var(--spacing-sm);
            border-top: 1px solid var(--border-gray);
          }

          .order-summary {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .order-total {
            text-align: left;
          }

          .order-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .order-card {
            padding: var(--spacing-md);
          }

          .item-image {
            width: 60px;
            height: 60px;
          }

          .order-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </Section>
  );
};
