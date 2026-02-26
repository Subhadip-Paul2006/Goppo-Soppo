import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.email, formData.password);
            // Assuming successful login returns user object. 
            // The AuthContext will update state.
            // Check role for redirect? Backend handles role in session, but we can check user.role here if needed
            // For now, redirect home.
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="bg-detective-dark p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-800">
                <h2 className="text-3xl font-serif text-gold-accent mb-6 text-center">
                    Agent Login
                </h2>

                {error && <div className="bg-red-900/50 text-red-200 p-2 mb-4 rounded text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />

                    <button type="submit" className="w-full bg-gold-accent text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors">
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/register" className="text-gray-400 hover:text-white text-sm">New Agent? Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
