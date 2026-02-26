import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaPause, FaHeart, FaClock, FaMusic } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';

const WriterProfile = () => {
    const { id } = useParams();
    const [data, setData] = useState({ writer: null, stories: [] });
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const { playStory, currentStory, isPlaying, togglePlay } = usePlayer();

    useEffect(() => {
        const fetchWriter = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/public/writer/${id}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWriter();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading Profile...</div>;
    if (!data.writer) return <div className="p-8 text-center text-red-500">Writer not found.</div>;

    const { writer, stories } = data;

    // Helper to format duration
    const formatTime = (seconds) => {
        if (!seconds || seconds === 0) return '--:--';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="bg-black min-h-screen relative">
            {/* Hero Section - Clearer Image */}
            <div className="relative w-full h-[55vh] overflow-hidden">
                {/* Gradient Overlay - Lighter to show image better */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>

                {writer.image_path ? (
                    <img
                        src={`http://localhost:5000${writer.image_path}`}
                        alt={writer.name}
                        className="w-full h-full object-cover object-top"
                        style={{
                            filter: 'contrast(1.05) saturate(1.1)',
                            imageRendering: 'auto'
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center">
                        <span className="text-9xl text-gray-700 font-serif">{writer.name[0]}</span>
                    </div>
                )}

                {/* Author Name Overlay on Hero */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-gold-accent font-bold tracking-widest uppercase text-sm mb-2 block">Premium Author</span>
                        <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-3 drop-shadow-2xl">{writer.name}</h1>
                        <p className="text-gray-200 text-lg font-medium flex items-center gap-2">
                            <span>Professional Writer</span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            <span>{stories.length} Audio Files</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 bg-black">
                <div className="p-8 max-w-7xl mx-auto pb-24">

                    {/* Popular Tracks Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                            {stories.slice(0, showAll ? stories.length : 10).map((story, index) => {
                                const isCurrent = currentStory?.id === story.id;
                                return (
                                    <div
                                        key={story.id}
                                        className={`flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer ${isCurrent ? 'bg-white/10' : ''}`}
                                        onClick={() => playStory(story)}
                                    >
                                        <div className="w-8 text-center text-gray-400 font-medium group-hover:text-white">
                                            {isCurrent && isPlaying ? (
                                                <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" className="h-4 w-4 mx-auto" />
                                            ) : (
                                                <span className="group-hover:hidden">{index + 1}</span>
                                            )}
                                            <FaPlay className="hidden group-hover:block mx-auto text-sm text-white" />
                                        </div>

                                        <div className="ml-4 flex-shrink-0 w-12 h-12">
                                            {story.thumbnail_path ? (
                                                <img src={`http://localhost:5000${story.thumbnail_path}`} className="w-full h-full object-cover rounded" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center"><FaMusic /></div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex-grow min-w-0">
                                            <h3 className={`font-medium truncate ${isCurrent ? 'text-gold-accent' : 'text-white'}`}>{story.title}</h3>
                                            <p className="text-sm text-gray-400 truncate">{story.genre}</p>
                                        </div>

                                        <div className="ml-4 text-gray-400 group-hover:text-white hidden sm:block">
                                            <FaHeart className="hover:text-gold-accent" />
                                        </div>
                                        <div className="text-sm text-gray-400 font-mono w-16 text-right ml-4">
                                            <TrackDuration story={story} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {stories.length > 10 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="mt-6 text-sm font-bold text-gray-300 hover:text-white tracking-widest uppercase hover:underline"
                            >
                                {showAll ? 'Show Less' : 'Show More'}
                            </button>
                        )}

                        {stories.length === 0 && (
                            <div className="text-gray-500 italic p-4">No stories uploaded for this writer yet.</div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 my-12"></div>

                    {/* About Section - Below Popular Tracks */}
                    <div className="max-w-4xl mb-20">
                        <h2 className="text-2xl font-bold text-white mb-8">About</h2>

                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-8 border border-[#2a2a2a] shadow-xl">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Author Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-[#2a2a2a] shadow-2xl">
                                        {writer.image_path ? (
                                            <img
                                                src={`http://localhost:5000${writer.image_path}`}
                                                alt={writer.name}
                                                className="w-full h-full object-cover"
                                                style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#3d3d3d] to-[#1a1a1a] flex items-center justify-center">
                                                <span className="text-5xl text-gray-600 font-serif">{writer.name[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Author Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                            <FaMusic className="text-xs" /> Verified Artist
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{writer.name}</h3>
                                    <p className="text-gold-accent font-medium mb-4">
                                        {stories.length} Published Stories
                                    </p>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {writer.bio || "No biography available for this writer. This author has contributed to our collection of premium audio stories."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-component to handle duration fetching if missing
const TrackDuration = ({ story }) => {
    const [duration, setDuration] = useState(story.duration || 0);

    useEffect(() => {
        if (!story.duration && story.audio_path) {
            const audio = new Audio(`http://localhost:5000${story.audio_path}`);
            audio.onloadedmetadata = () => {
                if (audio.duration && audio.duration !== Infinity) {
                    setDuration(audio.duration);
                }
            };
        }
    }, [story]);

    const formatTime = (seconds) => {
        if (!seconds || seconds === 0) return '--:--';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return <span>{formatTime(duration)}</span>;
};

export default WriterProfile;

