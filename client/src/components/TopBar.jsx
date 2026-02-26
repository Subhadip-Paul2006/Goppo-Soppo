import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';

const TopBar = ({ toggleMobileMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setQuery('');
        }
    };

    return (
        <div className="h-20 bg-[#121212]/95 backdrop-blur-xl w-full flex items-center justify-between px-4 md:px-8 border-b border-[#2a2a2a] sticky top-0 z-20 gap-2 md:gap-4">
            <button
                className="md:hidden text-white p-2 flex-shrink-0"
                onClick={toggleMobileMenu}
            >
                <FaBars className="text-xl" />
            </button>
            <div className="flex-1 w-full md:max-w-2xl">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search stories, writers, or genres..."
                        className="bg-[#2a2a2a] text-white rounded-full pl-10 md:pl-12 pr-4 md:pr-6 py-2 md:py-3 w-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:bg-[#333] transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-xs md:text-sm font-bold text-gray-300 hidden sm:block">Agent {user.name}</span>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-red-400 font-bold border border-red-900 px-2 md:px-3 py-1 rounded hover:bg-red-900/20 text-[10px] md:text-xs uppercase tracking-wider hidden sm:block">
                                Admin Dashboard
                            </Link>
                        )}
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                            <FaSignOutAlt className="text-xl" />
                        </button>
                        <FaUserCircle className="text-3xl text-gray-400" />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link to="/login" className="px-3 md:px-6 py-2 text-white font-bold hover:text-gold-accent transition-colors text-sm md:text-lg">
                            Log In
                        </Link>
                        <Link to="/register" className="bg-gold-accent text-black px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg hover:scale-105 hover:bg-yellow-400 transition-all shadow-lg shadow-gold-accent/20 flex-shrink-0">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
