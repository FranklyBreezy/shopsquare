import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Section, Grid, Flex } from '../components/Layout';
import { Button, Card, Input, LoadingSpinner } from '../components/UI';
import { api, Product, Shop, formatCurrencyINR } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Record<number, Shop>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cartId, setCartId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let productsData: Product[];
        let shopsData: Shop[];
        
        if (user?.role === 'SELLER') {
          // For sellers, only show their own products
          const userShops = await api.shops.getByOwnerId(user.id);
          if (userShops.length > 0) {
            const userShop = userShops[0];
            productsData = await api.products.getByShopId(userShop.id);
            shopsData = userShops;
          } else {
            productsData = [];
            shopsData = [];
          }
        } else {
          // For customers, show all products
          [productsData, shopsData] = await Promise.all([
            api.products.getAll(),
            api.shops.getAll()
          ]);
        }
        
        setProducts(productsData);
        
        // Create shops lookup
        const shopsMap = shopsData.reduce((acc, shop) => {
          acc[shop.id] = shop;
          return acc;
        }, {} as Record<number, Shop>);
        setShops(shopsMap);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProducts();
    }
  }, [user]);

  useEffect(() => {
    // Set initial filters from URL params
    const category = searchParams.get('category') || '';
    const shop = searchParams.get('shop') || '';
    const search = searchParams.get('search') || '';
    
    setSelectedCategory(category);
    setSelectedShop(shop);
    setSearchTerm(search);
  }, [searchParams]);

  const ensureCart = async (shopId: number) => {
    if (cartId) return cartId;
    if (!user) {
      alert('Please login to add items to cart');
      return null;
    }
    
    try {
      // First try to get existing cart for this user and shop
      const userCarts = await api.carts.getByUserId(user.id);
      const existingCart = userCarts.find(cart => cart.shopId === shopId);
      
      if (existingCart) {
        setCartId(existingCart.id);
        return existingCart.id;
      }
      
      // Create new cart if none exists
      const created = await api.carts.create({ userId: user.id, shopId });
      setCartId(created.id);
      return created.id;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  };

  const addToCart = async (productId: number, shopId: number) => {
    const id = await ensureCart(shopId);
    if (!id) return;

    try {
      await api.carts.addItem(id, { productId, quantity: 1 });
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId);
    const newParams = new URLSearchParams(searchParams);
    if (shopId) {
      newParams.set('shop', shopId);
    } else {
      newParams.delete('shop');
    }
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesShop = !selectedShop || product.shopId.toString() === selectedShop;
    
    return matchesSearch && matchesCategory && matchesShop;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const shopList = Object.values(shops);

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading products...</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="products-page">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              {user?.role === 'SELLER' ? 'My Products' : 'Products'}
            </h1>
            <p className="page-subtitle">
              {user?.role === 'SELLER' 
                ? 'Manage your product catalog' 
                : 'Discover amazing products from our trusted vendors'
              }
            </p>
          </div>

          {/* Filters */}
          <Card className="filters-card">
            <div className="filters-grid">
              <div className="filter-group">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {user?.role !== 'SELLER' && (
                <div className="filter-group">
                  <select
                    value={selectedShop}
                    onChange={(e) => handleShopChange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Shops</option>
                    {shopList.map(shop => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="filter-group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Results Count */}
          <div className="results-info">
            <p className="results-count">
              Showing {sortedProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No products found</h3>
              <p className="empty-message">
                Try adjusting your search criteria or browse all products
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedShop('');
                setSearchParams({});
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <Grid cols={4} gap="lg" className="products-grid">
              {sortedProducts.map((product) => (
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
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-category">{product.category}</div>
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-meta">
                      <div className="product-price">{formatCurrencyINR(product.price)}</div>
                      <div className="product-stock">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>

                    <div className="product-shop">
                      <span className="shop-label">Sold by:</span>
                      <Link to={`/shops/${product.shopId}`} className="shop-link">
                        {shops[product.shopId]?.name || 'Unknown Shop'}
                      </Link>
                    </div>

                    <div className="product-actions">
                      <Link to={`/products/${product.id}`}>
                        <Button variant="secondary" size="sm" className="view-btn">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id, product.shopId)}
                        disabled={product.stock === 0}
                        className="add-btn"
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </Grid>
          )}
        </div>
      </Container>

      <style jsx>{`
        .products-page {
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

        .filters-card {
          margin-bottom: var(--spacing-lg);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--spacing-md);
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .search-input {
          width: 100%;
        }

        .filter-select {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--button-bg);
          border: 1px solid var(--border-gray);
          border-radius: var(--radius-md);
          color: var(--text-white);
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          transition: all var(--transition-normal);
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(255, 61, 0, 0.1);
        }

        .results-info {
          margin-bottom: var(--spacing-lg);
        }

        .results-count {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .empty-state {
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
          margin-bottom: var(--spacing-lg);
        }

        .product-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
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

        .product-header {
          margin-bottom: var(--spacing-sm);
        }

        .product-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-white);
          line-height: 1.3;
        }

        .product-category {
          font-size: var(--font-size-xs);
          color: var(--primary-orange);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        .product-shop {
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-xs);
        }

        .shop-label {
          color: var(--subtext-gray);
        }

        .shop-link {
          color: var(--primary-orange);
          text-decoration: none;
          margin-left: var(--spacing-xs);
          transition: color var(--transition-normal);
        }

        .shop-link:hover {
          color: #e63500;
        }

        .product-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: auto;
        }

        .view-btn {
          flex: 1;
        }

        .add-btn {
          flex: 1;
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .filters-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }

        @media (max-width: 900px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .product-actions {
            flex-direction: column;
          }

          .view-btn,
          .add-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: var(--font-size-xl);
          }

          .product-image {
            height: 150px;
          }

          .product-name {
            font-size: var(--font-size-base);
          }
        }
      `}</style>
    </Section>
  );
};
