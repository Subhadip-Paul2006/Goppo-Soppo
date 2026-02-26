import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api/auth',
        withCredentials: true
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/me');
                if (res.data.isAuthenticated) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error('Auth check failed', err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        setUser(res.data.user);
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/register', userData);
        return res.data;
    };

    const verifyOTP = async (userId, otp) => {
        const res = await api.post('/verify-otp', { userId, otp });
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout }}>
            {loading ? <div className="text-white p-10">Initializing Detective Archives...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
