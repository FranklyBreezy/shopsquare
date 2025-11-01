import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Section, Grid, Flex } from '../components/Layout';
import { Button, Card, Input, LoadingSpinner, Modal } from '../components/UI';
import { api, CartItem, Product, Cart, formatCurrencyINR } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const CartPage: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    paymentMethod: 'cod'
  });
  const [processingOrder, setProcessingOrder] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      const userCarts = await api.carts.getByUserId(user.id);
      setCarts(userCarts);
      if (userCarts.length === 0) {
        setLoading(false);
        return;
      }
      
      // Load items for all carts
      const allItemsArrays = await Promise.all(userCarts.map(c => api.cartItems.getByCartId(c.id)));
      const allItems = allItemsArrays.flat();
      setItems(allItems);
      
      // Load product details for all unique products
      const productIds = Array.from(new Set(allItems.map(item => item.productId)));
      const productPromises = productIds.map(id => api.products.getById(id));
      const productData = await Promise.all(productPromises);
      
      const productsMap = productData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<number, Product>);
      
      setProducts(productsMap);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const existing = items.find(i => i.id === itemId);
      if (!existing) throw new Error('Item not found');
      await api.cartItems.update(itemId, { cartId: existing.cartId, productId: existing.productId, quantity: newQuantity });
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.cartItems.remove(itemId);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const calculateSubtotal = (cartId?: number) => {
    const relevant = cartId ? items.filter(i => i.cartId === cartId) : items;
    return relevant.reduce((sum, item) => {
      const product = products[item.productId];
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTax = (cartId?: number) => {
    return calculateSubtotal(cartId) * 0.08; // 8% tax
  };

  const calculateShipping = (cartId?: number) => {
    const subtotal = calculateSubtotal(cartId);
    return subtotal > 50 ? 0 : 99; // shipping flat INR 99 under threshold
  };

  const calculateTotal = (cartId?: number) => {
    return calculateSubtotal(cartId) + calculateTax(cartId) + calculateShipping(cartId);
  };

  const handleCheckout = async () => {
    if (!selectedCartId || !user) return;
    const cart = carts.find(c => c.id === selectedCartId);
    if (!cart) return;
    
    setProcessingOrder(true);
    
    try {
      // Create order
      const order = await api.orders.create({
        userId: user.id,
        shopId: cart.shopId,
        totalAmount: calculateTotal(selectedCartId),
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod
      });

      // Create order items
      for (const item of items.filter(i => i.cartId === selectedCartId)) {
        const product = products[item.productId];
        if (product) {
          await api.orderItems.create(order.id, {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          });
        }
      }

      // Clear cart
      await api.carts.delete(selectedCartId);
      
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
      setShowCheckout(false);
    }
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading your cart...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (carts.length === 0 || items.length === 0) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="empty-cart">
            <Card className="empty-cart-card">
              <div className="empty-icon">🛒</div>
              <h2 className="empty-title">Your cart is empty</h2>
              <p className="empty-message">
                Looks like you haven't added any items to your cart yet.
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
        <div className="cart-page">
          <div className="page-header">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">
              Review your items before checkout
            </p>
          </div>

          <div className="cart-content">
            {/* Cart Items grouped by cart/shop */}
            <div className="cart-items">
              {carts.map(cart => (
                <Card key={cart.id} className="items-card">
                  <div className="items-header">
                    <h2>Shop #{cart.shopId} Cart ({items.filter(i => i.cartId === cart.id).length})</h2>
                  </div>
                  
                  <div className="items-list">
                    {items.filter(i => i.cartId === cart.id).map((item) => {
                    const product = products[item.productId];
                    if (!product) return null;

                    return (
                      <div key={item.id} className="cart-item">
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
                          <h3 className="item-name">
                            <Link to={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className="item-description">{product.description}</p>
                          <div className="item-meta">
                            <span className="item-price">{formatCurrencyINR(product.price)}</span>
                            <span className="item-category">{product.category}</span>
                          </div>
                        </div>

                        <div className="item-quantity">
                          <label>Quantity:</label>
                          <div className="quantity-controls">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating[item.id]}
                            >
                              -
                            </Button>
                            <span className="quantity-display">
                              {updating[item.id] ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating[item.id]}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div className="item-total">
                          <div className="total-amount">
                            {formatCurrencyINR(product.price * item.quantity)}
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="remove-btn"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                    })}
                  </div>

                  {/* Order Summary per cart */}
                  <div className="order-summary">
                    <Card className="summary-card">
                      <h2 className="summary-title">Order Summary</h2>
                      
                      <div className="summary-details">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>{formatCurrencyINR(calculateSubtotal(cart.id))}</span>
                        </div>
                        
                        <div className="summary-row">
                          <span>Tax (8%):</span>
                          <span>{formatCurrencyINR(calculateTax(cart.id))}</span>
                        </div>
                        
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>
                            {calculateShipping(cart.id) === 0 ? 'FREE' : formatCurrencyINR(calculateShipping(cart.id))}
                          </span>
                        </div>
                        
                        {calculateShipping(cart.id) > 0 && (
                          <div className="shipping-note">
                            <small>Free shipping on orders over {formatCurrencyINR(50)}</small>
                          </div>
                        )}
                        
                        <div className="summary-row total-row">
                          <span>Total:</span>
                          <span>{formatCurrencyINR(calculateTotal(cart.id))}</span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        onClick={() => { setSelectedCartId(cart.id); setShowCheckout(true); }}
                        className="checkout-btn"
                      >
                        Proceed to Checkout
                      </Button>

                      <div className="continue-shopping">
                        <Link to="/products">
                          <Button variant="secondary">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Checkout Modal */}
          <Modal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            title="Checkout"
            size="lg"
          >
            <div className="checkout-form">
              <div className="form-section">
                <h3>Shipping Address</h3>
                <Input
                  label="Full Address"
                  placeholder="Enter your complete shipping address"
                  value={checkoutData.shippingAddress}
                  onChange={(value) => setCheckoutData(prev => ({ ...prev, shippingAddress: value }))}
                  required
                />
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={checkoutData.paymentMethod === 'cod'}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="order-total">
                <h3>Order Total</h3>
                <div className="total-breakdown">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrencyINR(calculateSubtotal())}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>{formatCurrencyINR(calculateTax())}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>{calculateShipping() === 0 ? 'FREE' : formatCurrencyINR(calculateShipping())}</span>
                  </div>
                  <div className="total-row final-total">
                    <span>Total:</span>
                    <span>{formatCurrencyINR(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  loading={processingOrder}
                  disabled={!checkoutData.shippingAddress || processingOrder}
                >
                  {processingOrder ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </Container>

      <style jsx>{`
        .cart-page {
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

        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-xl);
        }

        .items-card {
          margin-bottom: var(--spacing-lg);
        }

        .items-header {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-gray);
        }

        .items-header h2 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text-white);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto auto;
          gap: var(--spacing-lg);
          align-items: center;
          padding: var(--spacing-lg);
          border: 1px solid var(--border-gray);
          border-radius: var(--radius-lg);
          background-color: var(--hover-bg);
        }

        .item-image {
          width: 100px;
          height: 100px;
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
          font-size: var(--font-size-2xl);
          color: var(--subtext-gray);
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: var(--font-size-lg);
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

        .item-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
          line-height: 1.4;
        }

        .item-meta {
          display: flex;
          gap: var(--spacing-md);
          align-items: center;
        }

        .item-price {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--primary-orange);
        }

        .item-category {
          font-size: var(--font-size-xs);
          color: var(--subtext-gray);
          background-color: var(--button-bg);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
        }

        .item-quantity {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .item-quantity label {
          font-size: var(--font-size-sm);
          color: var(--text-white);
          font-weight: 500;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .quantity-display {
          min-width: 30px;
          text-align: center;
          font-weight: 500;
          color: var(--text-white);
        }

        .item-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-sm);
        }

        .total-amount {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--primary-orange);
        }

        .remove-btn {
          font-size: var(--font-size-sm);
        }

        .summary-card {
          position: sticky;
          top: var(--spacing-lg);
        }

        .summary-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--text-white);
        }

        .summary-details {
          margin-bottom: var(--spacing-lg);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--border-gray);
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .total-row {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-white);
          padding: var(--spacing-md) 0;
          border-top: 2px solid var(--primary-orange);
          margin-top: var(--spacing-sm);
        }

        .shipping-note {
          text-align: center;
          margin-top: var(--spacing-sm);
        }

        .shipping-note small {
          color: var(--subtext-gray);
          font-size: var(--font-size-xs);
        }

        .checkout-btn {
          width: 100%;
          margin-bottom: var(--spacing-md);
          box-shadow: var(--shadow-glow);
        }

        .continue-shopping {
          text-align: center;
        }

        .continue-shopping .btn {
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

        .empty-cart {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-cart-card {
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

        /* Checkout Modal Styles */
        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .form-section h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .payment-methods {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .payment-method {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          color: var(--text-white);
        }

        .payment-method input[type="radio"] {
          accent-color: var(--primary-orange);
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .card-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .order-total {
          background-color: var(--hover-bg);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-gray);
        }

        .order-total h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .total-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .final-total {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--primary-orange);
          border-top: 2px solid var(--primary-orange);
          padding-top: var(--spacing-md);
          margin-top: var(--spacing-sm);
        }

        .checkout-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .summary-card {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: var(--spacing-md);
          }

          .item-quantity,
          .item-total {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            margin-top: var(--spacing-md);
            padding-top: var(--spacing-md);
            border-top: 1px solid var(--border-gray);
          }

          .card-row {
            grid-template-columns: 1fr;
          }

          .checkout-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            padding: var(--spacing-md);
          }

          .item-image {
            width: 80px;
            height: 80px;
          }

          .item-name {
            font-size: var(--font-size-base);
          }

          .item-quantity,
          .item-total {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </Section>
  );
};
