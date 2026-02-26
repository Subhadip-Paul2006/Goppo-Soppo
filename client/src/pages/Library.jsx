import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { FaPlay, FaHeart, FaMusic, FaPlus, FaLock, FaGlobe } from 'react-icons/fa';

import StoryModal from '../components/StoryModal';

const Library = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);
    const { playStory } = usePlayer();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchLibraryData = async () => {
            try {
                // Fetch both liked stories and playlists in parallel
                const [libraryRes, playlistsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/user/library', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/playlists', { withCredentials: true })
                ]);

                setFavorites(libraryRes.data.liked || []);
                setPlaylists(playlistsRes.data.playlists || []);
            } catch (err) {
                console.error('Error fetching library:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibraryData();
    }, [user]);

    if (!user) {
        return (
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl text-gold-accent mb-4">Restricted Access</h2>
                <p className="text-gray-400">Please login to access your personal detective archives.</p>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center text-gold-accent animate-pulse">Retrieving Evidence...</div>;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <StoryModal
                story={selectedStory}
                onClose={() => setSelectedStory(null)}
                onPlay={playStory}
            />

            <h1 className="text-2xl md:text-4xl font-serif text-white mb-6 md:mb-8 border-b border-gray-800 pb-4">
                <span className="text-gold-accent">M</span>y Library
            </h1>

            {/* Playlists Section */}
            <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-200">My Playlists</h2>
                    <Link
                        to="/create-playlist"
                        className="flex items-center gap-2 text-gold-accent hover:text-gold-accent/80 transition-colors text-xs md:text-sm"
                    >
                        <FaPlus /> Create New
                    </Link>
                </div>

                {playlists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {playlists.map(playlist => (
                            <Link
                                key={playlist.id}
                                to={`/playlist/${playlist.id}`}
                                className="bg-detective-dark p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="aspect-square bg-gradient-to-br from-[#3d3d3d] to-[#1a1a1a] rounded mb-3 overflow-hidden relative">
                                    {playlist.cover_image ? (
                                        <img
                                            src={`http://localhost:5000${playlist.cover_image}`}
                                            alt={playlist.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaMusic className="text-4xl text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <div className="w-12 h-12 rounded-full bg-gold-accent flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <FaPlay className="text-black ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        {playlist.privacy === 'private' ? (
                                            <FaLock className="text-gray-400 text-xs" />
                                        ) : (
                                            <FaGlobe className="text-gray-400 text-xs" />
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-sm md:text-base truncate">{playlist.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400">{playlist.item_count || 0} tracks</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#181818] rounded-xl p-8 text-center border border-[#2a2a2a]">
                        <FaMusic className="text-5xl text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">You haven't created any playlists yet.</p>
                        <Link
                            to="/create-playlist"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-accent text-black font-bold rounded-full hover:bg-gold-accent/90 transition-colors"
                        >
                            <FaPlus /> Create Your First Playlist
                        </Link>
                    </div>
                )}
            </div>

            {/* Liked Stories Section */}
            <div className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-4 md:mb-6 flex items-center gap-2">
                    <FaHeart className="text-red-500" /> Liked Stories
                </h2>
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {favorites.map(story => (
                            <div
                                key={story.id}
                                onClick={() => setSelectedStory(story)}
                                className="bg-detective-dark p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="aspect-square bg-gray-700 rounded mb-3 overflow-hidden relative">
                                    {story.thumbnail_path ? (
                                        <img
                                            src={`http://localhost:5000${story.thumbnail_path}`}
                                            alt={story.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <FaPlay className="text-white text-3xl" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-sm md:text-base truncate">{story.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400 truncate">{story.writer_name || story.genre}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">You haven't bookmarked any cases yet.</p>
                )}
            </div>
        </div>
    );
};

export default Library;

