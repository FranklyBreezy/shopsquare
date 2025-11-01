import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, useUser } from '../state/UserContext';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const onSelect = (id: number) => {
    const u = users.find(u => u.id === id) || null;
    if (u) setUser(u as any);
    navigate('/');
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>Select a user</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}><button onClick={() => onSelect(u.id)}>{u.name}</button></li>
        ))}
      </ul>
    </div>
  );
};


