import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import {
    FaPlay, FaPause, FaMusic, FaLock, FaGlobe, FaEllipsisH,
    FaTrash, FaEdit, FaArrowLeft, FaPlus
} from 'react-icons/fa';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { playStory, currentStory, isPlaying } = usePlayer();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/playlists/${id}`, {
                withCredentials: true
            });
            setPlaylist(response.data.playlist);
        } catch (err) {
            console.error('Fetch playlist error:', err);
            setError(err.response?.data?.error || 'Failed to load playlist');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (playlist?.items?.length > 0) {
            playStory(playlist.items[0]);
        }
    };

    const handlePlayStory = (story) => {
        playStory(story);
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm('Are you sure you want to delete this playlist?')) return;

        setDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/playlists/${id}`, {
                withCredentials: true
            });
            navigate('/library');
        } catch (err) {
            console.error('Delete playlist error:', err);
            setError('Failed to delete playlist');
            setDeleting(false);
        }
    };

    const handleRemoveStory = async (storyId) => {
        try {
            await axios.delete(`http://localhost:5000/api/playlists/${id}/items/${storyId}`, {
                withCredentials: true
            });
            // Refresh playlist
            fetchPlaylist();
        } catch (err) {
            console.error('Remove story error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gold-accent text-xl animate-pulse">Loading playlist...</div>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-red-400 text-xl">{error || 'Playlist not found'}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gold-accent hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-80 w-full overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#3d2f4d] via-[#2a2040] to-[#181818]" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-8">
                    <div className="flex items-end gap-6 w-full">
                        {/* Cover Image */}
                        <div className="w-56 h-56 rounded-lg shadow-2xl overflow-hidden flex-shrink-0 bg-[#282828]">
                            {playlist.cover_image ? (
                                <img
                                    src={`http://localhost:5000${playlist.cover_image}`}
                                    alt={playlist.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3d3d3d] to-[#1a1a1a]">
                                    <FaMusic className="text-6xl text-gray-600" />
                                </div>
                            )}
                        </div>

                        {/* Playlist Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {playlist.privacy === 'private' ? (
                                    <FaLock className="text-gray-400 text-sm" />
                                ) : (
                                    <FaGlobe className="text-gray-400 text-sm" />
                                )}
                                <span className="text-sm text-gray-400 uppercase tracking-wider">
                                    {playlist.privacy} Playlist
                                </span>
                            </div>
                            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                {playlist.title}
                            </h1>
                            {playlist.description && (
                                <p className="text-gray-300 text-sm mb-3 max-w-2xl line-clamp-2">
                                    {playlist.description}
                                </p>
                            )}
                            <div className="text-sm text-gray-400">
                                <span className="text-white font-medium">{playlist.owner_name || 'Unknown'}</span>
                                <span className="mx-2">•</span>
                                <span>{playlist.items?.length || 0} tracks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                    <FaArrowLeft />
                </button>
            </div>

            {/* Actions Bar */}
            <div className="px-8 py-6 bg-gradient-to-b from-[#181818]/80 to-transparent flex items-center gap-6">
                <button
                    onClick={handlePlayAll}
                    disabled={!playlist.items?.length}
                    className="w-14 h-14 rounded-full bg-gold-accent text-black flex items-center justify-center hover:scale-105 hover:bg-gold-accent/90 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                >
                    <FaPlay className="ml-1" size={20} />
                </button>

                {playlist.isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition-colors"
                        >
                            <FaEllipsisH size={20} />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute left-0 top-full mt-2 bg-[#282828] rounded-lg shadow-xl py-2 min-w-[180px] z-20">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            navigate(`/edit-playlist/${id}`);
                                        }}
                                        className="w-full px-4 py-3 text-left text-gray-300 hover:bg-[#333] hover:text-white flex items-center gap-3 transition-colors"
                                    >
                                        <FaEdit /> Edit Playlist
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            handleDeletePlaylist();
                                        }}
                                        disabled={deleting}
                                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#333] hover:text-red-300 flex items-center gap-3 transition-colors"
                                    >
                                        <FaTrash /> Delete Playlist
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Tracks List */}
            <div className="px-8 pb-32">
                {playlist.items?.length > 0 ? (
                    <div className="space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-[40px_1fr_120px] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-800">
                            <span>#</span>
                            <span>Title</span>
                            <span>Added</span>
                        </div>

                        {/* Tracks */}
                        {playlist.items.map((story, index) => {
                            const isCurrentlyPlaying = currentStory?.id === story.id && isPlaying;

                            return (
                                <div
                                    key={story.id}
                                    className={`grid grid-cols-[40px_1fr_120px] gap-4 px-4 py-3 rounded-lg hover:bg-[#282828] group transition-colors cursor-pointer ${isCurrentlyPlaying ? 'bg-[#282828]' : ''
                                        }`}
                                    onClick={() => handlePlayStory(story)}
                                >
                                    <div className="flex items-center justify-center">
                                        <span className="group-hover:hidden text-gray-400">
                                            {isCurrentlyPlaying ? (
                                                <FaPause className="text-gold-accent" />
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <FaPlay className="hidden group-hover:block text-white" size={12} />
                                    </div>

                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-[#333]">
                                            {story.thumbnail_path ? (
                                                <img
                                                    src={`http://localhost:5000${story.thumbnail_path}`}
                                                    alt={story.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FaMusic className="text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`font-medium truncate ${isCurrentlyPlaying ? 'text-gold-accent' : 'text-white'}`}>
                                                {story.title}
                                            </div>
                                            <div className="text-sm text-gray-400 truncate">
                                                {story.writer_name || story.genre || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>
                                            {story.added_at ? new Date(story.added_at).toLocaleDateString() : '-'}
                                        </span>
                                        {playlist.isOwner && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveStory(story.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FaMusic className="text-6xl text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-300 mb-2">This playlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start adding stories to your playlist</p>
                        <Link
                            to="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-accent text-black font-bold rounded-full hover:bg-gold-accent/90 transition-colors"
                        >
                            <FaPlus /> Find Stories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;
