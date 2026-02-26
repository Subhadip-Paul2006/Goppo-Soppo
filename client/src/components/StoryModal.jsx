import React, { useEffect, useState } from 'react';
import { FaPlay, FaTimes, FaPlus, FaThumbsUp } from 'react-icons/fa';
import AddToPlaylistModal from './AddToPlaylistModal';

const StoryModal = ({ story, onClose, onPlay }) => {
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!story) return null;

    // Random match percentage for that "Netflix" feel
    const matchScore = Math.floor(Math.random() * (99 - 85) + 85);
    const year = new Date().getFullYear(); // Or parse story.created_at

    // Check if it's likely a playlist (no genre, no audio_path maybe?)
    // Or just check fields.
    const isPlaylist = !story.genre && !story.writer_name && !story.audio_path;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <div className="relative bg-[#181818] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate-fade-in-up md:max-h-[80vh] overflow-y-auto scrollbar-hide">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 bg-[#181818] text-white p-2 rounded-full hover:bg-[#282828] transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>

                    {/* Hero Image Section */}
                    <div className="relative h-[28rem] w-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent z-10 w-full h-full"></div>
                        {story.thumbnail_path ? (
                            <img
                                src={`http://localhost:5000${story.thumbnail_path}`}
                                alt={story.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                <span className="text-gray-700 text-6xl font-serif">?</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section: Title, Buttons, Metadata, Description */}
                    <div className="px-12 pb-12 -mt-16 relative z-20">

                        {/* Title & Actions - Now below banner but slightly overlapping or just below */}
                        <div className="mb-8">
                            <h2 className="text-6xl font-serif font-bold text-white mb-6 drop-shadow-xl leading-tight">
                                {story.title}
                            </h2>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        if (!isPlaylist && story.audio_path) {
                                            onPlay(story);
                                        } else {
                                            console.log("Play logic for playlist/item not implemented yet or missing audio");
                                        }
                                        onClose();
                                    }}
                                    className="bg-white text-black px-8 py-3 rounded font-bold text-lg flex items-center gap-3 hover:bg-opacity-90 transition-all hover:scale-105"
                                >
                                    <FaPlay size={22} /> {isPlaylist ? 'Open Playlist' : "Let's Begin"}
                                </button>
                                <button
                                    onClick={() => setShowAddToPlaylist(true)}
                                    className="border-2 border-gray-500 text-gray-300 p-3 rounded-full hover:border-gold-accent hover:text-gold-accent hover:bg-gold-accent/10 transition-all group"
                                    title="Add to Playlist"
                                >
                                    <FaPlus size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button className="border-2 border-gray-500 text-gray-300 p-3 rounded-full hover:border-white hover:text-white transition-colors">
                                    <FaThumbsUp size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            {/* Left Column: Metadata & Description */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center gap-4 text-sm font-bold">
                                    <span className="text-green-400">{matchScore}% Match</span>
                                    <span className="text-gray-400">{year}</span>
                                    <span className="border border-gray-500 px-2 py-0.5 rounded text-xs text-gray-400">HD</span>
                                    <span className="border border-gray-500 px-2 py-0.5 rounded text-xs text-gray-400">5.1</span>
                                </div>

                                <p className="text-lg text-white leading-relaxed">
                                    {story.description || "No description available. Dive in to uncover the mystery."}
                                </p>
                            </div>

                            {/* Right Column: Key Info */}
                            <div className="text-sm space-y-4">
                                {!isPlaylist && (
                                    <>
                                        <div>
                                            <span className="text-gray-500">Cast: </span>
                                            <span className="text-gray-300 hover:underline cursor-pointer">Aditya Murti</span>,
                                            <span className="text-gray-300 hover:underline cursor-pointer"> Somak</span>,
                                            <span className="text-gray-300 hover:underline cursor-pointer"> Deep</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Genres: </span>
                                            <span className="text-gray-300">{story.genre || "Mystery, Thriller"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">This story is: </span>
                                            <span className="text-gray-300">Suspenseful, Exciting</span>
                                        </div>
                                    </>
                                )}
                                {isPlaylist && (
                                    <div>
                                        <span className="text-gray-500">Type: </span>
                                        <span className="text-gray-300">Curated Collection</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add to Playlist Modal */}
            <AddToPlaylistModal
                story={story}
                isOpen={showAddToPlaylist}
                onClose={() => setShowAddToPlaylist(false)}
            />
        </>
    );
};

export default StoryModal;

