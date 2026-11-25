import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ct_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ct_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((res) => {
        const u = res.data.user || res.data;
        setUser(u);
        localStorage.setItem('ct_user', JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem('ct_token');
        localStorage.removeItem('ct_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password, role }) => {
    const res = await api.post('/auth/login', { email, password, role });
    localStorage.setItem('ct_token', res.data.token);
    localStorage.setItem('ct_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('ct_token', res.data.token);
    localStorage.setItem('ct_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('ct_token');
    localStorage.removeItem('ct_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    const u = res.data.user || res.data;
    setUser(u);
    localStorage.setItem('ct_user', JSON.stringify(u));
    return u;
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
