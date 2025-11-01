import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Section, Grid, Flex } from '../components/Layout';
import { Button, Card, Input, LoadingSpinner } from '../components/UI';
import { api, Product, Shop, formatCurrencyINR } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartId, setCartId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await api.products.getById(parseInt(id));
        setProduct(productData);
        
        // Load shop information
        const shopData = await api.shops.getById(productData.shopId);
        setShop(shopData);
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const ensureCart = async () => {
    if (cartId) return cartId;
    if (!user) {
      alert('Please login to add items to cart');
      return null;
    }
    
    try {
      // First try to get existing cart for this user and shop
      const userCarts = await api.carts.getByUserId(user.id);
      const existingCart = userCarts.find(cart => cart.shopId === product?.shopId);
      
      if (existingCart) {
        setCartId(existingCart.id);
        return existingCart.id;
      }
      
      // Create new cart if none exists
      const created = await api.carts.create({ userId: user.id, shopId: product?.shopId || 1 });
      setCartId(created.id);
      return created.id;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  };

  const addToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    const id = await ensureCart();
    if (!id) {
      setAddingToCart(false);
      return;
    }

    try {
      await api.carts.addItem(id, { productId: product.id, quantity });
      alert(`Added ${quantity} item(s) to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    if (!product) return;
    
    // Add to cart first, then navigate to checkout
    await addToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading product details...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <Card className="error-state">
            <div className="error-icon">❌</div>
            <h3 className="error-title">Product Not Found</h3>
            <p className="error-message">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [''];

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="product-detail">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/products" className="breadcrumb-link">Products</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          <div className="product-content">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                {images[selectedImage] ? (
                  <img src={images[selectedImage]} alt={product.name} />
                ) : (
                  <div className="placeholder-image">
                    <span>📦</span>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="image-thumbnails">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      {image ? (
                        <img src={image} alt={`${product.name} ${index + 1}`} />
                      ) : (
                        <div className="thumbnail-placeholder">
                          <span>📦</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <div className="product-category">{product.category}</div>
                <h1 className="product-name">{product.name}</h1>
                <div className="product-rating">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <span className="rating-text">(4.8) • 127 reviews</span>
                </div>
              </div>

              <div className="product-price-section">
                <div className="price">{formatCurrencyINR(product.price)}</div>
                <div className="stock-status">
                  {product.stock > 0 ? (
                    <span className="in-stock">✓ {product.stock} in stock</span>
                  ) : (
                    <span className="out-of-stock">✗ Out of stock</span>
                  )}
                </div>
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              {product.brand && (
                <div className="product-brand">
                  <strong>Brand:</strong> {product.brand}
                </div>
              )}

              {product.sku && (
                <div className="product-sku">
                  <strong>SKU:</strong> {product.sku}
                </div>
              )}

              {/* Shop Info */}
              {shop && (
                <Card className="shop-info-card">
                  <div className="shop-header">
                    <div className="shop-logo">
                      {shop.logo ? (
                        <img src={shop.logo} alt={shop.name} />
                      ) : (
                        <div className="placeholder-logo">
                          <span>{shop.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="shop-details">
                      <h3 className="shop-name">{shop.name}</h3>
                      <p className="shop-location">📍 {shop.city}, {shop.state}</p>
                    </div>
                  </div>
                  <p className="shop-description">{shop.description}</p>
                  <Link to={`/shops/${shop.id}`}>
                    <Button variant="secondary" size="sm">
                      Visit Shop
                    </Button>
                  </Link>
                </Card>
              )}

              {/* Add to Cart */}
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity.toString()}
                      onChange={(value) => setQuantity(Math.max(1, parseInt(value) || 1))}
                      className="quantity-input"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="cart-actions">
                  <Button
                    size="lg"
                    onClick={addToCart}
                    disabled={product.stock === 0 || addingToCart}
                    loading={addingToCart}
                    className="add-cart-btn"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={buyNow}
                    disabled={product.stock === 0}
                    className="buy-now-btn"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="product-specifications">
            <h2>Product Specifications</h2>
            <Grid cols={2} gap="lg">
              <div className="spec-group">
                <h3>General</h3>
                <div className="spec-list">
                  <div className="spec-item">
                    <span className="spec-label">Category:</span>
                    <span className="spec-value">{product.category}</span>
                  </div>
                  {product.brand && (
                    <div className="spec-item">
                      <span className="spec-label">Brand:</span>
                      <span className="spec-value">{product.brand}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="spec-item">
                      <span className="spec-label">SKU:</span>
                      <span className="spec-value">{product.sku}</span>
                    </div>
                  )}
                  <div className="spec-item">
                    <span className="spec-label">Availability:</span>
                    <span className="spec-value">
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="spec-group">
                <h3>Pricing</h3>
                <div className="spec-list">
                  <div className="spec-item">
                    <span className="spec-label">Price:</span>
                    <span className="spec-value">{formatCurrencyINR(product.price)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Stock:</span>
                    <span className="spec-value">{product.stock} units</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Shop:</span>
                    <span className="spec-value">
                      {shop ? (
                        <Link to={`/shops/${shop.id}`} className="shop-link">
                          {shop.name}
                        </Link>
                      ) : (
                        'Unknown Shop'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .product-detail {
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

        .product-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-2xl);
        }

        .product-images {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .main-image {
          width: 100%;
          height: 400px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: var(--hover-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          font-size: var(--font-size-4xl);
          color: var(--subtext-gray);
        }

        .image-thumbnails {
          display: flex;
          gap: var(--spacing-sm);
          overflow-x: auto;
          padding: var(--spacing-xs) 0;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          background: none;
          cursor: pointer;
          transition: all var(--transition-normal);
          flex-shrink: 0;
        }

        .thumbnail.active {
          border-color: var(--primary-orange);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--hover-bg);
          font-size: var(--font-size-lg);
          color: var(--subtext-gray);
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .product-header {
          margin-bottom: var(--spacing-md);
        }

        .product-category {
          font-size: var(--font-size-xs);
          color: var(--primary-orange);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-sm);
        }

        .product-name {
          font-size: var(--font-size-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
          line-height: 1.2;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .stars {
          font-size: var(--font-size-lg);
        }

        .rating-text {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .product-price-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
        }

        .price {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--primary-orange);
        }

        .stock-status {
          font-size: var(--font-size-sm);
        }

        .in-stock {
          color: #10b981;
        }

        .out-of-stock {
          color: #ef4444;
        }

        .product-description h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .product-description p {
          color: var(--subtext-gray);
          line-height: 1.6;
        }

        .product-brand,
        .product-sku {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .shop-info-card {
          padding: var(--spacing-lg);
        }

        .shop-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .shop-logo {
          width: 60px;
          height: 60px;
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
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .shop-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-white);
        }

        .shop-location {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .shop-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
        }

        .add-to-cart-section {
          background-color: var(--hover-bg);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-gray);
        }

        .quantity-selector {
          margin-bottom: var(--spacing-lg);
        }

        .quantity-selector label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
          font-weight: 500;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .quantity-input {
          width: 80px;
          text-align: center;
        }

        .cart-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .add-cart-btn,
        .buy-now-btn {
          flex: 1;
        }

        .product-specifications {
          margin-top: var(--spacing-2xl);
        }

        .product-specifications h2 {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--text-white);
        }

        .spec-group h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .spec-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--border-gray);
        }

        .spec-label {
          color: var(--subtext-gray);
          font-weight: 500;
        }

        .spec-value {
          color: var(--text-white);
        }

        .shop-link {
          color: var(--primary-orange);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .shop-link:hover {
          color: #e63500;
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
          .product-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }

          .main-image {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .product-name {
            font-size: var(--font-size-2xl);
          }

          .price {
            font-size: var(--font-size-2xl);
          }

          .cart-actions {
            flex-direction: column;
          }

          .add-cart-btn,
          .buy-now-btn {
            width: 100%;
          }

          .product-specifications {
            margin-top: var(--spacing-xl);
          }

          .product-specifications h2 {
            font-size: var(--font-size-xl);
          }
        }

        @media (max-width: 480px) {
          .product-name {
            font-size: var(--font-size-xl);
          }

          .main-image {
            height: 250px;
          }

          .thumbnail {
            width: 60px;
            height: 60px;
          }

          .shop-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </Section>
  );
};
