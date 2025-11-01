import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { useUser } from '../state/UserContext';

type Product = { id: number; name: string; description?: string; price: number; stock: number; shopId: number };

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<number | null>(null);
  const { user } = useUser();

  useEffect(() => {
    api.get<Product[]>('/api/products').then(setProducts).finally(() => setLoading(false));
  }, []);

  const ensureCart = async () => {
    if (cartId) return cartId;
    const created = await api.post<{ id: number }>('/api/carts', { userId: user?.id || 1, shopId: 1 });
    setCartId(created.id);
    return created.id;
  };

  const addToCart = async (productId: number) => {
    const id = await ensureCart();
    await api.post(`/api/carts/${id}/items`, { cartId: id, productId, quantity: 1 });
    alert('Added to cart');
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
          <p style={{ margin: '4px 0', color: '#555' }}>{p.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>${p.price}</strong>
            <button onClick={() => addToCart(p.id)}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
};


