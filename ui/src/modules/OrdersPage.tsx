import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';

type Order = { id: number; userId: number; shopId: number; totalAmount: number; status: string };

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const list = await api.get<Order[]>('/api/orders');
    setOrders(list);
  };

  useEffect(() => { load(); }, []);

  const place = async () => {
    await api.post('/api/orders', { userId: 1, shopId: 1, totalAmount: 0, status: 'PENDING' });
    await load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Orders</h2>
        <button onClick={place}>Place Order</button>
      </div>
      {!orders.length ? (
        <p>No orders.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Status</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.status}</td>
                <td align="right">${o.totalAmount?.toFixed?.(2) || o.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


