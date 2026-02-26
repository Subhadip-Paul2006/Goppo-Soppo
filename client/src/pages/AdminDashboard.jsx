import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaFeatherAlt, FaMicrophone, FaList, FaChartLine } from 'react-icons/fa';
import AddWriter from '../components/admin/AddWriter';
import AddStory from '../components/admin/AddStory';
import CreatePlaylist from '../components/admin/CreatePlaylist';
import axios from 'axios';

const AdminDashboard = () => {
    // ... (rest of imports and state)
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ stories: 0, writers: 0, playlists: 0 });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            if (activeTab === 'dashboard') {
                try {
                    const [storiesRes, writersRes, playlistsRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/admin/stories', { withCredentials: true }),
                        axios.get('http://localhost:5000/api/admin/writers', { withCredentials: true }),
                        axios.get('http://localhost:5000/api/admin/playlists', { withCredentials: true })
                    ]);
                    setStats({
                        stories: storiesRes.data.length,
                        writers: writersRes.data.length,
                        playlists: playlistsRes.data.filter(p => p.is_global).length // Filter for Global Playlists based on UI label
                    });
                } catch (err) {
                    console.error("Error fetching stats:", err);
                }
            }
        };
        fetchStats();
    }, [activeTab]);
    // ... (useEffect and loading checks)

    // ... (tabs JSX)

    // Content Area
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Headers and Tabs ... */}
            <h1 className="text-xl md:text-3xl font-serif text-gold-accent mb-6 md:mb-8 border-b border-gray-800 pb-4">
                Admin Secure Channel
            </h1>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-bold transition-colors text-sm md:text-base ${activeTab === 'dashboard' ? 'bg-gray-800 text-gold-accent border-b-2 border-gold-accent' : 'text-gray-400 hover:bg-gray-900'}`}
                >
                    <FaChartLine /> Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('add_writer')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-bold transition-colors text-sm md:text-base ${activeTab === 'add_writer' ? 'bg-gray-800 text-gold-accent border-b-2 border-gold-accent' : 'text-gray-400 hover:bg-gray-900'}`}
                >
                    <FaFeatherAlt /> Add Writer
                </button>
                <button
                    onClick={() => setActiveTab('add_story')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-bold transition-colors text-sm md:text-base ${activeTab === 'add_story' ? 'bg-gray-800 text-gold-accent border-b-2 border-gold-accent' : 'text-gray-400 hover:bg-gray-900'}`}
                >
                    <FaMicrophone /> Upload Story
                </button>
                <button
                    onClick={() => setActiveTab('create_playlist')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-bold transition-colors text-sm md:text-base ${activeTab === 'create_playlist' ? 'bg-gray-800 text-gold-accent border-b-2 border-gold-accent' : 'text-gray-400 hover:bg-gray-900'}`}
                >
                    <FaList /> Create Global Playlist
                </button>
            </div>

            <div className="bg-gray-900 p-4 md:p-8 rounded-b-lg rounded-r-lg min-h-[500px] border border-gray-800">
                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">System Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 font-bold">Total Stories</h3>
                                    <FaMicrophone className="text-gold-accent text-2xl" />
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.stories}</p>
                            </div>
                            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 font-bold">Active Writers</h3>
                                    <FaFeatherAlt className="text-gold-accent text-2xl" />
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.writers}</p>
                            </div>
                            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 font-bold">Global Playlists</h3>
                                    <FaList className="text-gold-accent text-2xl" />
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.playlists}</p>
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-gray-900/50 rounded-xl border border-dashed border-gray-700 text-center">
                            <p className="text-gray-500 mb-4">Select an action from the tabs above to manage content.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'add_writer' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Add New Writer</h2>
                        <AddWriter />
                    </div>
                )}
                {/* ... other tabs */}

                {activeTab === 'add_story' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Upload New Story</h2>
                        <AddStory />
                    </div>
                )}
                {activeTab === 'create_playlist' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Create Global Playlist</h2>
                        <CreatePlaylist />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
