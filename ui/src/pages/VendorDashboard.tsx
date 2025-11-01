import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, Grid } from '../components/Layout';
import { Button, Card, Input, LoadingSpinner, Modal } from '../components/UI';
import { api, Product, Shop, CreateShopRequest } from '../services/apiClient';
import { useUser } from '../state/UserContext';

// Shop Creation Form Component
const CreateShopForm: React.FC<{ onShopCreated: () => void }> = ({ onShopCreated }) => {
  const [shopForm, setShopForm] = useState<CreateShopRequest>({
    name: '',
    description: '',
    ownerId: 0,
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setShopForm(prev => ({ ...prev, ownerId: user.id }));
    }
  }, [user]);

  const handleFormChange = (field: keyof CreateShopRequest) => (value: string) => {
    setShopForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.shops.create(shopForm);
      onShopCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create shop');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shop-form">
      <div className="form-fields">
        <Input
          label="Shop Name"
          value={shopForm.name}
          onChange={handleFormChange('name')}
          placeholder="Enter your shop name"
          required
        />
        <Input
          label="Description"
          value={shopForm.description}
          onChange={handleFormChange('description')}
          placeholder="Describe your shop"
          required
        />
        <Input
          label="Address"
          value={shopForm.address}
          onChange={handleFormChange('address')}
          placeholder="Street address"
          required
        />
        <div className="field-row">
          <Input
            label="City"
            value={shopForm.city}
            onChange={handleFormChange('city')}
            placeholder="City"
            required
          />
          <Input
            label="State"
            value={shopForm.state}
            onChange={handleFormChange('state')}
            placeholder="State"
            required
          />
        </div>
        <Input
          label="ZIP Code"
          value={shopForm.zipCode}
          onChange={handleFormChange('zipCode')}
          placeholder="ZIP Code"
          required
        />
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={saving}
        className="create-shop-btn"
      >
        {saving ? 'Creating Shop...' : 'Create My Shop'}
      </Button>
    </form>
  );
};

export const VendorDashboard: React.FC = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    sku: '',
    images: ''
  });
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      return;
    }
    loadVendorData();
  }, [user]);

  const loadVendorData = async () => {
    if (!user) return;
    
    try {
      const userShops = await api.shops.getByOwnerId(user.id);
      if (userShops.length === 0) {
        setLoading(false);
        return;
      }
      
      const userShop = userShops[0];
      setShop(userShop);
      
      const shopProducts = await api.products.getByShopId(userShop.id);
      setProducts(shopProducts);
    } catch (error) {
      console.error('Error loading vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!shop || !user) return;
    
    setSaving(true);
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category: productForm.category,
        brand: productForm.brand || undefined,
        sku: productForm.sku || undefined,
        images: productForm.images ? productForm.images.split(',').map(url => url.trim()) : [],
        shopId: shop.id
      };

      if (editingProduct) {
        await api.products.update(editingProduct.id, productData);
      } else {
        await api.products.create(productData);
      }

      await loadVendorData();
      setShowAddProduct(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      brand: product.brand || '',
      sku: product.sku || '',
      images: product.images.join(', ')
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.products.delete(productId);
      await loadVendorData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      brand: '',
      sku: '',
      images: ''
    });
  };

  const handleFormChange = (field: keyof typeof productForm) => (value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading vendor dashboard...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!user || user.role !== 'SELLER') {
    return (
      <Section padding="lg">
        <Container size="lg">
          <Card className="access-denied">
            <div className="access-icon">🚫</div>
            <h2 className="access-title">Access Denied</h2>
            <p className="access-message">
              You need to be a vendor to access this dashboard.
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  if (!shop) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <Card className="no-shop">
            <div className="no-shop-icon">🏪</div>
            <h2 className="no-shop-title">Welcome to Your Vendor Dashboard!</h2>
            <p className="no-shop-message">
              You don't have a shop registered yet. Let's create your shop to start selling products.
            </p>
            <CreateShopForm onShopCreated={loadVendorData} />
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="vendor-dashboard">
          <div className="page-header">
            <h1 className="page-title">Vendor Dashboard</h1>
            <p className="page-subtitle">
              Manage your shop and products
            </p>
          </div>

          {/* Shop Overview */}
          <Card className="shop-overview">
            <div className="shop-header">
              <div className="shop-info">
                <h2 className="shop-name">{shop.name}</h2>
                <p className="shop-description">{shop.description}</p>
                <div className="shop-stats">
                  <div className="stat-item">
                    <span className="stat-label">Products:</span>
                    <span className="stat-value">{products.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Status:</span>
                    <span className={`stat-value ${shop.isActive ? 'active' : 'inactive'}`}>
                      {shop.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shop-actions">
                <Button onClick={() => setShowAddProduct(true)}>
                  Add Product
                </Button>
                <Link to="/orders-received">
                  <Button variant="secondary">
                    View Orders
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Products Management */}
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">Products Management</h2>
              <p className="section-subtitle">
                Manage your product catalog
              </p>
            </div>

            {products.length === 0 ? (
              <Card className="empty-products">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No products yet</h3>
                <p className="empty-message">
                  Start by adding your first product to your shop.
                </p>
                <Button onClick={() => setShowAddProduct(true)}>
                  Add First Product
                </Button>
              </Card>
            ) : (
              <Grid cols={3} gap="lg" className="products-grid">
                {products.map((product) => (
                  <Card key={product.id} className="product-card">
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
                        <div className="product-price">${product.price.toFixed(2)}</div>
                        <div className="product-stock">
                          Stock: {product.stock}
                        </div>
                      </div>

                      <div className="product-category">
                        <span className="category-badge">{product.category}</span>
                      </div>
                    </div>

                    <div className="product-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="delete-btn"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </Grid>
            )}
          </div>

          {/* Add/Edit Product Modal */}
          <Modal
            isOpen={showAddProduct}
            onClose={() => {
              setShowAddProduct(false);
              setEditingProduct(null);
              resetForm();
            }}
            title={editingProduct ? 'Edit Product' : 'Add New Product'}
            size="lg"
          >
            <div className="product-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-fields">
                  <Input
                    label="Product Name"
                    value={productForm.name}
                    onChange={handleFormChange('name')}
                    required
                    placeholder="Enter product name"
                  />
                  <Input
                    label="Description"
                    value={productForm.description}
                    onChange={handleFormChange('description')}
                    required
                    placeholder="Enter product description"
                  />
                  <div className="field-row">
                    <Input
                      label="Price"
                      type="number"
                      value={productForm.price}
                      onChange={handleFormChange('price')}
                      required
                      placeholder="0.00"
                    />
                    <Input
                      label="Stock"
                      type="number"
                      value={productForm.stock}
                      onChange={handleFormChange('stock')}
                      required
                      placeholder="0"
                    />
                  </div>
                  <div className="field-row">
                    <Input
                      label="Category"
                      value={productForm.category}
                      onChange={handleFormChange('category')}
                      required
                      placeholder="Enter category"
                    />
                    <Input
                      label="Brand"
                      value={productForm.brand}
                      onChange={handleFormChange('brand')}
                      placeholder="Enter brand (optional)"
                    />
                  </div>
                  <Input
                    label="SKU"
                    value={productForm.sku}
                    onChange={handleFormChange('sku')}
                    placeholder="Enter SKU (optional)"
                  />
                  <Input
                    label="Image URLs"
                    value={productForm.images}
                    onChange={handleFormChange('images')}
                    placeholder="Enter image URLs separated by commas"
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  loading={saving}
                  disabled={!productForm.name || !productForm.description || !productForm.price || !productForm.stock || !productForm.category}
                >
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </Container>

      <style jsx>{`
        .vendor-dashboard {
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

        .shop-overview {
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-xl);
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .shop-name {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .shop-description {
          color: var(--subtext-gray);
          font-size: var(--font-size-base);
          margin-bottom: var(--spacing-lg);
          line-height: 1.6;
        }

        .shop-stats {
          display: flex;
          gap: var(--spacing-lg);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .stat-label {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .stat-value {
          color: var(--text-white);
          font-size: var(--font-size-lg);
          font-weight: 600;
        }

        .stat-value.active {
          color: #10b981;
        }

        .stat-value.inactive {
          color: #6b7280;
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
          line-height: 1.3;
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
          font-size: var(--font-size-sm);
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
          display: flex;
          gap: var(--spacing-sm);
          margin-top: auto;
        }

        .delete-btn {
          background-color: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #ef4444;
        }

        .delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.2);
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
          margin-bottom: var(--spacing-lg);
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        .access-denied,
        .no-shop {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .access-icon,
        .no-shop-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-lg);
        }

        .access-title,
        .no-shop-title {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
        }

        .access-message,
        .no-shop-message {
          color: var(--subtext-gray);
          margin-bottom: var(--spacing-lg);
        }

        /* Product Form Styles */
        .product-form {
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

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .shop-header {
            flex-direction: column;
            gap: var(--spacing-lg);
            align-items: flex-start;
          }

          .shop-stats {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .section-title {
            font-size: var(--font-size-xl);
          }

          .section-subtitle {
            font-size: var(--font-size-base);
          }

          .field-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .shop-overview {
            padding: var(--spacing-lg);
          }

          .shop-name {
            font-size: var(--font-size-xl);
          }

          .product-actions {
            flex-direction: column;
          }

          .product-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </Section>
  );
};
