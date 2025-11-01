import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/apiClient';

type CartItem = { id: number; cartId: number; productId: number; quantity: number };
type Product = { id: number; name: string; price: number };

export const CartPage: React.FC = () => {
  const [cartId, setCartId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});

  useEffect(() => {
    // naive: assume single cart id 1 to fetch; you can persist in localStorage later
    setCartId(1);
  }, []);

  useEffect(() => {
    if (!cartId) return;
    api.get<CartItem[]>(`/api/carts/${cartId}/items`).then(setItems);
  }, [cartId]);

  useEffect(() => {
    const load = async () => {
      const uniqueIds = Array.from(new Set(items.map((i) => i.productId)));
      const entries = await Promise.all(uniqueIds.map(async (id) => [id, await api.get<Product>(`/api/products/${id}`)] as const));
      setProducts(Object.fromEntries(entries));
    };
    if (items.length) load();
  }, [items]);

  const total = useMemo(() => items.reduce((sum, it) => sum + (products[it.productId]?.price || 0) * it.quantity, 0), [items, products]);

  return (
    <div>
      <h2>Your Cart</h2>
      {!items.length ? (
        <p>No items.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Product</th>
              <th align="right">Qty</th>
              <th align="right">Price</th>
              <th align="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{products[i.productId]?.name || i.productId}</td>
                <td align="right">{i.quantity}</td>
                <td align="right">${products[i.productId]?.price?.toFixed(2) || '0.00'}</td>
                <td align="right">${(((products[i.productId]?.price || 0) * i.quantity).toFixed(2))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} align="right"><strong>Total</strong></td>
              <td align="right"><strong>${total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};


