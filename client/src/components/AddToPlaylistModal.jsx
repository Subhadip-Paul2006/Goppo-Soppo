import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaMusic, FaPlus, FaCheck, FaSpinner, FaLock } from 'react-icons/fa';

const AddToPlaylistModal = ({ story, isOpen, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingTo, setAddingTo] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUserPlaylists();
            setSuccessMessage('');
            setErrorMessage('');
        }
    }, [isOpen]);

    const fetchUserPlaylists = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/playlists', {
                withCredentials: true
            });
            // Filter out global playlists - only show user's own playlists
            const userPlaylists = (response.data.playlists || []).filter(p => !p.is_global);
            setPlaylists(userPlaylists);
        } catch (err) {
            console.error('Error fetching playlists:', err);
            setErrorMessage('Failed to load playlists');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId, playlistTitle) => {
        if (addingTo) return; // Prevent double-click

        setAddingTo(playlistId);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.post(
                `http://localhost:5000/api/playlists/${playlistId}/items`,
                { storyId: story.id },
                { withCredentials: true }
            );

            setSuccessMessage(`Added to "${playlistTitle}"`);

            // Auto-close after success
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error adding to playlist:', err);
            if (err.response?.data?.error === 'Story already in playlist') {
                setErrorMessage('Already in this playlist');
            } else {
                setErrorMessage(err.response?.data?.error || 'Failed to add');
            }
        } finally {
            setAddingTo(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#282828] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#404040]">
                    <h3 className="text-lg font-bold text-white">Add to Playlist</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-full transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Story Preview */}
                <div className="p-4 bg-[#333] flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-[#444]">
                        {story?.thumbnail_path ? (
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
                        <p className="text-white font-medium truncate">{story?.title}</p>
                        <p className="text-sm text-gray-400 truncate">{story?.writer_name || story?.genre}</p>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mx-4 mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
                        <FaCheck /> {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Playlist List */}
                <div className="p-4 max-h-64 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                            Loading playlists...
                        </div>
                    ) : playlists.length > 0 ? (
                        <div className="space-y-2">
                            {playlists.map(playlist => (
                                <button
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id, playlist.title)}
                                    disabled={addingTo !== null}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#404040] transition-colors text-left disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#3d3d3d] to-[#1a1a1a]">
                                        {playlist.cover_image ? (
                                            <img
                                                src={`http://localhost:5000${playlist.cover_image}`}
                                                alt={playlist.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaMusic className="text-gray-600 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{playlist.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {playlist.item_count || 0} tracks
                                            {playlist.privacy === 'private' && (
                                                <span className="ml-2 inline-flex items-center gap-1">
                                                    <FaLock className="text-xs" /> Private
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {addingTo === playlist.id ? (
                                        <FaSpinner className="animate-spin text-gold-accent" />
                                    ) : (
                                        <FaPlus className="text-gray-500 group-hover:text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FaMusic className="text-4xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 mb-2">No playlists yet</p>
                            <p className="text-sm text-gray-500">Create a playlist first to add stories</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#404040]">
                    <a
                        href="/create-playlist"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#333] hover:bg-[#404040] text-white rounded-lg transition-colors"
                    >
                        <FaPlus /> Create New Playlist
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
