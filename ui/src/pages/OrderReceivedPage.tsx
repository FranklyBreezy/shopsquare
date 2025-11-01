import React, { useEffect, useState } from 'react';
import { Container, Section, Grid, Flex } from '../components/Layout';
import { Button, Card, LoadingSpinner } from '../components/UI';
import { api, Order, OrderItem, Product, User, formatCurrencyINR } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const OrderReceivedPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [shopActive, setShopActive] = useState<boolean>(true);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [currentShopId, setCurrentShopId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const { user } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      // Get user's shop
      const userShops = await api.shops.getByOwnerId(user.id);
      if (userShops.length === 0) {
        setLoading(false);
        return;
      }
      
      const userShop = userShops[0];
      setShopActive(!!userShop.isActive);
      setCurrentShopId(userShop.id);
      const shopOrders = await api.orders.getByShopId(userShop.id);
      setOrders(shopOrders);
      
      // Load order items and products
      const itemsMap: Record<number, OrderItem[]> = {};
      const productIds = new Set<number>();
      const userIds = new Set<number>();
      
      for (const order of shopOrders) {
        const items = await api.orderItems.getByOrderId(order.id);
        itemsMap[order.id] = items;
        items.forEach(item => productIds.add(item.productId));
        userIds.add(order.userId);
      }
      
      setOrderItems(itemsMap);
      
      // Load products and users
      const productPromises = Array.from(productIds).map(id => api.products.getById(id));
      const productData = await Promise.all(productPromises);
      
      const productsMap = productData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<number, Product>);
      
      setProducts(productsMap);
      
      // Load user information
      const userPromises = Array.from(userIds).map(id => api.users.getById(id));
      const userData = await Promise.all(userPromises);
      
      const usersMap = userData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<number, User>);
      
      setUsers(usersMap);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await api.orders.updateStatus(orderId, newStatus);
      // If confirming the first order, ensure the seller's shop is active
      if (newStatus === 'CONFIRMED' && user) {
        const shops = await api.shops.getByOwnerId(user.id);
        if (shops.length > 0 && shops[0].isActive === false) {
          await api.shops.update(shops[0].id, { isActive: true });
          setShopActive(true);
        }
      }
      await loadOrders(); // Reload orders to get updated status
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING':
        return '#f59e0b';
      case 'CONFIRMED':
        return '#3b82f6';
      case 'SHIPPED':
        return '#8b5cf6';
      case 'COMPLETED':
        return '#059669';
      case 'DELIVERED':
        return '#10b981';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusActions = (order: Order) => {
    const actions = [];
    
    if ((order.status || '').toUpperCase() === 'PENDING') {
      actions.push(
        <Button
          key="accept"
          variant="success"
          size="sm"
          onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
          loading={updating[order.id]}
        >
          Confirm
        </Button>
      );
      actions.push(
        <Button
          key="deny"
          variant="danger"
          size="sm"
          onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
          loading={updating[order.id]}
        >
          Cancel
        </Button>
      );
    } else if ((order.status || '').toUpperCase() === 'CONFIRMED') {
      actions.push(
        <Button
          key="complete"
          variant="primary"
          size="sm"
          onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
          loading={updating[order.id]}
        >
          Mark Delivered
        </Button>
      );
      actions.push(
        <Button
          key="mark-completed"
          variant="secondary"
          size="sm"
          onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
          loading={updating[order.id]}
        >
          Mark Completed
        </Button>
      );
    }
    
    return actions;
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading orders...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (user?.role !== 'SELLER') {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>This page is only accessible to sellers.</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="orders-received-page">
          <div className="page-header">
            <h1 className="page-title">Orders Received</h1>
            <p className="page-subtitle">
              Manage orders from your customers
            </p>
          </div>

          <div className="orders-list">
            {(() => {
              const displayOrders = orders.filter(order => {
                const items = orderItems[order.id] || [];
                return items.some(it => {
                  const p = products[it.productId];
                  return currentShopId ? p && p.shopId === currentShopId : true;
                });
              });
              if (displayOrders.length === 0) {
                return (
                  <Card className="empty-orders">
                    <div className="empty-icon">📦</div>
                    <h3 className="empty-title">No orders yet</h3>
                    <p className="empty-message">
                      You haven't received any orders from customers yet.
                    </p>
                  </Card>
                );
              }
              return displayOrders.map((order, idx) => {
                const items = (orderItems[order.id] || []).filter(it => {
                  const p = products[it.productId];
                  return currentShopId ? p && p.shopId === currentShopId : true;
                });
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                const customer = users[order.userId];
                const vendorOrderNumber = idx + 1; // 1-based per-vendor sequence
                return (
                  <Card key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3 className="order-id">Order #{vendorOrderNumber}</h3>
                        <p className="order-date">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {customer && (
                          <p className="customer-info">
                            Customer: {customer.name} ({customer.email})
                          </p>
                        )}
                      </div>
                      <div className="order-status">
                        <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                          {order.status}
                        </div>
                        <div className="order-total">
                          {(() => {
                            const computedTotal = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
                            return <>Total: {formatCurrencyINR(computedTotal)}</>;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="order-items">
                      <h4>Order Items ({totalItems} items)</h4>
                      <div className="items-list">
                        {items.map((item) => {
                          const product = products[item.productId];
                          return (
                            <div key={item.id} className="order-item">
                              <div className="item-info">
                                <span className="item-name">
                                  {product ? product.name : 'Unknown Product'}
                                </span>
                                <span className="item-quantity">Qty: {item.quantity}</span>
                              </div>
                              <div className="item-price">
                                {formatCurrencyINR(Number((item.price || 0) * (item.quantity || 0)))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="shipping-section">
                      <h4>Shipping Address</h4>
                      <div className="shipping-address">
                        {order.shippingAddress || 'N/A'}
                      </div>
                    </div>

                    <div className="order-actions">
                      {getStatusActions(order)}
                    </div>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      </Container>

      <style jsx>{`
        .orders-received-page {
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
          border: 1px solid var(--border-gray);
          border-radius: var(--radius-lg);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-lg);
        }

        .order-info {
          flex: 1;
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
          margin-bottom: var(--spacing-xs);
        }

        .customer-info {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }

        .order-status {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
          margin-bottom: var(--spacing-xs);
        }

        .order-total {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-white);
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
          gap: var(--spacing-sm);
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm);
          background-color: var(--hover-bg);
          border-radius: var(--radius-md);
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .item-name {
          font-weight: 500;
          color: var(--text-white);
        }

        .item-quantity {
          font-size: var(--font-size-sm);
          color: var(--subtext-gray);
        }

        .item-price {
          font-weight: 600;
          color: var(--primary-orange);
        }

        .order-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }

        .empty-orders {
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
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .empty-message {
          color: var(--subtext-gray);
          font-size: var(--font-size-base);
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        .access-denied {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .access-denied h1 {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .access-denied p {
          color: var(--subtext-gray);
          font-size: var(--font-size-base);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .order-status {
            text-align: left;
          }

          .order-actions {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Section>
  );
};
