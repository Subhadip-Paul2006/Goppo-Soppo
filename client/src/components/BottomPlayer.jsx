import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart, FaVolumeUp, FaUndo, FaRedo } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const BottomPlayer = () => {
    const { currentStory, isPlaying, togglePlay, currentTime, duration, seek, volume, handleVolume, skip, playbackRate, handlePlaybackRate } = usePlayer();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Reset like status when story changes (optimistic or fetch real status if needed)
    useEffect(() => {
        setIsLiked(false);
        setLikeCount(0); // Reset count temporarily
        const fetchLikeStatus = async () => {
            if (currentStory?.id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/public/story/${currentStory.id}/meta`, { withCredentials: true });
                    setIsLiked(res.data.isLiked);
                    setLikeCount(res.data.count);
                } catch (err) {
                    console.error("Error fetching like status", err);
                }
            }
        };
        fetchLikeStatus();
    }, [currentStory]);

    const handleLike = async () => {
        if (!user) {
            alert("Please login to add to library");
            return;
        }

        // Store previous values for error rollback
        const previousIsLiked = isLiked;
        const previousCount = likeCount;

        try {
            // Optimistic update for visual feedback only
            setIsLiked(!isLiked);

            const res = await axios.post('http://localhost:5000/api/user/like', { storyId: currentStory.id }, { withCredentials: true });

            // Use server response as source of truth
            if (res.data.count !== undefined) {
                setLikeCount(res.data.count);
                setIsLiked(res.data.liked);
            }
        } catch (err) {
            console.error(err);
            // Revert on error
            setIsLiked(previousIsLiked);
            setLikeCount(previousCount);
        }
    };

    const toggleSpeed = () => {
        const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
        const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
        handlePlaybackRate(speeds[nextIndex]);
    };

    if (!currentStory) return null;

    return (
        <div className="h-24 md:h-28 bg-[#0a0a0a] border-t border-[#333] flex flex-col md:flex-row md:items-center px-2 md:px-8 py-2 md:py-0 fixed bottom-0 w-full z-30 shadow-2xl shadow-black">
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start mb-2 md:mb-0 gap-2">
                {/* Song Info */}
                <div className="flex items-center gap-2 md:gap-6 flex-1 md:w-[30%] md:flex-none">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-lg overflow-hidden shadow-lg shadow-black/50 relative group flex-shrink-0">
                        {currentStory.thumbnail_path ? (
                            <img src={`http://localhost:5000${currentStory.thumbnail_path}`} alt="Thumb" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[10px] md:text-xs text-gray-500 text-center">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm md:text-lg font-bold hover:underline cursor-pointer truncate mb-0 md:mb-1">{currentStory.title}</h4>
                        <p className="text-xs md:text-sm text-gray-400 hover:text-white cursor-pointer transition-colors truncate">By Author Name</p>
                    </div>
                    <button onClick={handleLike} className={`text-xl md:text-2xl hover:scale-110 transition-transform ${isLiked ? 'text-gold-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-gray-500 hover:text-white'} flex flex-col items-center gap-1 flex-shrink-0 mx-2`}>
                        <FaHeart />
                    </button>
                </div>

                {/* Play/Pause control for mobile on the right side of song info */}
                <div className="md:hidden flex items-center gap-3">
                    <button className="text-gray-400 text-lg hover:text-white transition-colors transform" title="Previous"><FaStepBackward /></button>
                    <button
                        onClick={togglePlay}
                        className="bg-white text-black rounded-full p-3 hover:scale-110 hover:bg-gold-accent transition-all shadow-lg"
                    >
                        {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="pl-0.5 text-sm" />}
                    </button>
                    <button className="text-gray-400 text-lg hover:text-white transition-colors transform" title="Next"><FaStepForward /></button>
                </div>
            </div>

            {/* Controls */}
            {/* Controls */}
            <div className="flex-1 flex flex-col justify-center items-center w-full md:max-w-2xl mx-auto">
                <div className="hidden md:flex items-center gap-8 mb-3">
                    {/* -10s */}
                    <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white transition-colors text-xl hover:scale-110 active:scale-95" title="Rewind 10s">
                        <FaUndo /> <span className="text-xs absolute -mt-6 -ml-2">10</span>
                    </button>

                    <button className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110 transform" title="Previous"><FaStepBackward /></button>

                    <button
                        onClick={togglePlay}
                        className="bg-white text-black rounded-full p-4 hover:scale-110 hover:bg-gold-accent transition-all shadow-lg shadow-white/10"
                    >
                        {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="pl-1 text-xl" />}
                    </button>

                    <button className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110 transform" title="Next"><FaStepForward /></button>

                    {/* +10s */}
                    <button onClick={() => skip(10)} className="text-gray-400 hover:text-white transition-colors text-xl hover:scale-110 active:scale-95" title="Forward 10s">
                        <FaRedo /> <span className="text-xs absolute -mt-6 -ml-2">10</span>
                    </button>

                    {/* Speed */}
                    <button onClick={toggleSpeed} className="w-12 text-gray-400 hover:text-white font-bold text-sm border border-gray-600 rounded px-1 hover:border-white transition-all ml-4">
                        {playbackRate}x
                    </button>
                </div>

                <div className="w-full flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-gray-400 select-none">
                    <span className="w-8 md:w-10 text-right">{formatTime(currentTime)}</span>
                    <div className="h-1 md:h-1.5 bg-gray-800 rounded-full flex-1 relative group cursor-pointer">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={(e) => seek(parseFloat(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-gradient-to-r from-gray-500 to-white rounded-full group-hover:from-gold-accent group-hover:to-yellow-300 absolute top-0 left-0 pointer-events-none transition-all"
                            style={{ width: `${(duration ? (currentTime / duration) : 0) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="w-8 md:w-10">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            {/* Volume */}
            <div className="hidden md:flex w-[30%] justify-end items-center gap-4">
                <FaVolumeUp className="text-gray-400 text-lg" />
                <div className="w-32 h-1.5 bg-gray-800 rounded-full cursor-pointer relative group">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => handleVolume(parseFloat(e.target.value))}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                        className="h-full bg-gray-400 group-hover:bg-gold-accent rounded-full absolute top-0 left-0 pointer-events-none transition-colors"
                        style={{ width: `${volume * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default BottomPlayer;
