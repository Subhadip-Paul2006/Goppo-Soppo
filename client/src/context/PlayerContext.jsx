import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentStory, setCurrentStory] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);

    const audioRef = useRef(new Audio());

    // Handle story change
    useEffect(() => {
        if (currentStory) {
            audioRef.current.src = `http://localhost:5000${currentStory.audio_path}`;
            audioRef.current.load();
            audioRef.current.playbackRate = playbackRate; // Maintain speed
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        }
    }, [currentStory]);

    // Handle events
    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    // Handle Play/Pause
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play error", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle Speed
    useEffect(() => {
        audioRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    const playStory = (story) => {
        if (currentStory?.id === story.id) {
            togglePlay();
        } else {
            setCurrentStory(story);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const skip = (seconds) => {
        const newTime = audioRef.current.currentTime + seconds;
        audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
    };

    const handleVolume = (val) => setVolume(val);
    const handlePlaybackRate = (val) => setPlaybackRate(val);

    return (
        <PlayerContext.Provider value={{
            currentStory,
            isPlaying,
            duration,
            currentTime,
            volume,
            playbackRate,
            playStory,
            togglePlay,
            seek,
            skip,
            handleVolume,
            handlePlaybackRate
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
