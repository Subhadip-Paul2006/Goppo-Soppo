import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMusic, FaCamera, FaLock, FaGlobe, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const CreatePlaylist = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        privacy: 'private'
    });
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'title' && error) setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Playlist name is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title.trim());
            data.append('description', formData.description);
            data.append('privacy', formData.privacy);
            if (coverImage) {
                data.append('coverImage', coverImage);
            }

            const response = await axios.post('http://localhost:5000/api/playlists', data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.playlist) {
                navigate(`/playlist/${response.data.playlist.id}`);
            }
        } catch (err) {
            console.error('Create playlist error:', err);
            if (err.response?.status === 401) {
                setError('Please login to create a playlist');
            } else {
                setError(err.response?.data?.error || 'Failed to create playlist');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2d1f3d] via-[#1a1a2e] to-black pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                        <span className="text-gold-accent">Create</span> New Playlist
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Organize your favorite stories & songs into a collection
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-[#181818] rounded-2xl p-8 shadow-2xl border border-[#2a2a2a]">

                    {/* Cover Image Section */}
                    <div className="flex flex-col sm:flex-row gap-8 mb-8">
                        <div className="flex-shrink-0">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-48 h-48 rounded-xl bg-[#282828] flex flex-col items-center justify-center cursor-pointer hover:bg-[#333] transition-all duration-300 group overflow-hidden border-2 border-dashed border-[#404040] hover:border-gold-accent relative"
                            >
                                {coverPreview ? (
                                    <>
                                        <img
                                            src={coverPreview}
                                            alt="Cover preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <FaCamera className="text-white text-3xl" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <FaMusic className="text-5xl text-gray-600 group-hover:text-gold-accent transition-colors mb-3" />
                                        <FaCamera className="text-lg text-gray-500 group-hover:text-white transition-colors" />
                                        <span className="text-xs text-gray-500 mt-2 group-hover:text-gray-300">Choose image</span>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 space-y-6">
                            {/* Playlist Name */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Playlist Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter playlist name..."
                                    className={`w-full px-4 py-3 bg-[#282828] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-accent focus:border-transparent transition-all ${error && !formData.title.trim() ? 'border-red-500' : 'border-[#404040]'
                                        }`}
                                    maxLength={100}
                                />
                                {error && !formData.title.trim() && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-pulse">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description <span className="text-gray-500">(optional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Add a description for your playlist..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#282828] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-accent focus:border-transparent transition-all resize-none"
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-gray-500 text-right">
                                    {formData.description.length}/500
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-4">
                            Privacy Settings
                        </label>
                        <div className="flex gap-4">
                            <label
                                className={`flex-1 flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${formData.privacy === 'public'
                                        ? 'bg-gold-accent/10 border-2 border-gold-accent'
                                        : 'bg-[#282828] border-2 border-transparent hover:border-[#404040]'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="public"
                                    checked={formData.privacy === 'public'}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <FaGlobe className={`text-2xl ${formData.privacy === 'public' ? 'text-gold-accent' : 'text-gray-500'}`} />
                                <div>
                                    <div className={`font-medium ${formData.privacy === 'public' ? 'text-gold-accent' : 'text-white'}`}>
                                        Public
                                    </div>
                                    <div className="text-xs text-gray-500">Anyone can see</div>
                                </div>
                            </label>

                            <label
                                className={`flex-1 flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${formData.privacy === 'private'
                                        ? 'bg-gold-accent/10 border-2 border-gold-accent'
                                        : 'bg-[#282828] border-2 border-transparent hover:border-[#404040]'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="private"
                                    checked={formData.privacy === 'private'}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <FaLock className={`text-2xl ${formData.privacy === 'private' ? 'text-gold-accent' : 'text-gray-500'}`} />
                                <div>
                                    <div className={`font-medium ${formData.privacy === 'private' ? 'text-gold-accent' : 'text-white'}`}>
                                        Private
                                    </div>
                                    <div className="text-xs text-gray-500">Only you can see</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && formData.title.trim() && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-full font-medium text-gray-300 hover:text-white hover:bg-[#282828] transition-all duration-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gold-accent text-black font-bold rounded-full hover:bg-gold-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-gold-accent/20 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Playlist'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylist;
