import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay } from 'react-icons/fa';
import StoryModal from '../components/StoryModal';

const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);
    const { playStory } = usePlayer();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/genres');
                setGenres(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    const handleGenreClick = async (genre) => {
        setSelectedGenre(genre);
        try {
            const res = await axios.get(`http://localhost:5000/api/public/search?q=${genre}`);
            setStories(res.data.stories.filter(s => s.genre === genre));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-gold-accent">Deciphering Archives...</div>;

    return (
        <div className="p-4 md:p-8 min-h-screen bg-black">
            <StoryModal
                story={selectedStory}
                onClose={() => setSelectedStory(null)}
                onPlay={playStory}
            />

            <h1 className="text-2xl md:text-4xl font-serif text-white mb-6 md:mb-8 border-b border-gray-800 pb-4">
                <span className="text-gold-accent">C</span>ase Files by Genre
            </h1>

            {!selectedGenre ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {genres.map((genre, index) => (
                        <div
                            key={index}
                            onClick={() => handleGenreClick(genre)}
                            className="bg-gray-900 border border-gray-700 p-6 md:p-8 rounded-lg hover:border-gold-accent hover:bg-gray-800 cursor-pointer transition-all group"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-gray-300 group-hover:text-gold-accent text-center">{genre}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedGenre(null)} className="mb-4 md:mb-6 text-gold-accent hover:underline text-sm md:text-base">
                        &larr; Back to Genres
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Genre: {selectedGenre}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {stories.map(story => (
                            <div key={story.id} onClick={() => setSelectedStory(story)} className="bg-detective-dark p-2 md:p-3 rounded hover:bg-gray-800 transition-colors cursor-pointer group">
                                <div className="aspect-square bg-gray-700 rounded mb-3 overflow-hidden relative">
                                    {story.thumbnail_path ? (
                                        <img src={`http://localhost:5000${story.thumbnail_path}`} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <FaPlay className="text-white text-3xl" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-sm md:text-base truncate">{story.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400 truncate">{story.genre}</p>
                            </div>
                        ))}
                        {stories.length === 0 && <p className="text-gray-500">No cases found in this archive.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Genres;
