import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaMusic, FaUserSecret, FaPlusSquare, FaHeart, FaHistory, FaTimes } from 'react-icons/fa';

const NavItem = ({ to, icon, label, active, onClick }) => (
    <Link to={to} onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-gold-accent text-black font-bold shadow-lg shadow-gold-accent/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm tracking-wide">{label}</span>
    </Link>
);

const SectionLabel = ({ label }) => (
    <div className="px-4 mt-8 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
);

const Sidebar = ({ setIsMobileMenuOpen }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full h-full bg-[#121212] flex flex-col border-r border-[#2a2a2a] flex-shrink-0">
            {/* Logo Area */}
            <div className="p-6 mb-2 flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                    <span className="bg-gold-accent text-black p-2 rounded-lg"><FaUserSecret /></span>
                    Goppo Soppo
                </h1>
                {/* Mobile Close Button */}
                <button
                    className="md:hidden text-gray-400 hover:text-white p-2"
                    onClick={() => setIsMobileMenuOpen?.(false)}
                >
                    <FaTimes className="text-2xl" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-20 custom-scrollbar">
                <SectionLabel label="Discover" />
                <div className="space-y-1">
                    <NavItem to="/" icon={<FaHome />} label="Home" active={isActive('/')} onClick={() => setIsMobileMenuOpen?.(false)} />
                    <NavItem to="/search" icon={<FaSearch />} label="Search" active={isActive('/search')} onClick={() => setIsMobileMenuOpen?.(false)} />
                    <NavItem to="/genres" icon={<FaMusic />} label="Genres & Albums" active={isActive('/genres')} onClick={() => setIsMobileMenuOpen?.(false)} />
                    <NavItem to="/coming-soon" icon={<FaHistory />} label="Radio (Coming Soon)" active={isActive('/coming-soon')} onClick={() => setIsMobileMenuOpen?.(false)} />
                </div>

                <SectionLabel label="Your Library" />
                <div className="space-y-1">
                    <NavItem to="/library" icon={<FaHeart />} label="Liked Songs" active={isActive('/library')} onClick={() => setIsMobileMenuOpen?.(false)} />
                    <NavItem to="/library" icon={<FaHistory />} label="Recent" active={isActive('/recent')} onClick={() => setIsMobileMenuOpen?.(false)} />
                </div>

                <SectionLabel label="Playlists" />
                <div className="space-y-1">
                    <Link to="/create-playlist" onClick={() => setIsMobileMenuOpen?.(false)} className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left">
                        <span className="bg-gray-700 p-1 rounded-sm"><FaPlusSquare /></span>
                        <span className="text-sm">Create Playlist</span>
                    </Link>
                    {/* Dynamic Playlists would go here */}
                </div>
            </nav>

            {/* User Profile / Admin Link at bottom */}
            <div className="p-4 border-t border-[#2a2a2a] bg-[#0a0a0a]">
                <Link to="/admin" onClick={() => setIsMobileMenuOpen?.(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-red-500 text-xs font-bold border border-red-800">
                        AD
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Manage Content</div>
                        <div className="text-sm font-bold text-white">Admin Panel</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
