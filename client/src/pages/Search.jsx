import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaUser, FaSearch } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ stories: [], writers: [] });
    const [loading, setLoading] = useState(false);
    const { playStory } = usePlayer();

    // Sync URL params to local state
    useEffect(() => {
        const urlQuery = searchParams.get('q') || '';
        setQuery(urlQuery);
    }, [searchParams]);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults({ stories: [], writers: [] });
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/public/search?q=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error("Error searching:", err);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Update URL when query changes
    useEffect(() => {
        if (query.trim()) {
            setSearchParams({ q: query });
        }
    }, [query, setSearchParams]);

    return (
        <div className="p-8 min-h-screen pb-32">
            <h2 className="text-3xl font-bold text-white mb-6">Search</h2>

            {/* Search Input */}
            <div className="mb-8 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search stories, writers, or genres..."
                        className="bg-[#2a2a2a] text-white rounded-full pl-12 pr-6 py-4 w-full focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:bg-[#333] transition-all text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch className="text-xl" />
                    </div>
                </div>
            </div>

            {loading && <div className="text-gray-400 mb-4">Searching...</div>}

            {query.trim() && (
                <>
                    {/* Writers First */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Writers</h3>
                        {results.writers.length === 0 ? (
                            <p className="text-gray-400">No writers found.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {results.writers.map(writer => (
                                    <div
                                        key={writer.id}
                                        onClick={() => navigate(`/writer/${writer.id}`)}
                                        className="bg-[#1e1e1e] p-6 rounded-lg hover:bg-[#2a2a2a] transition-all flex flex-col items-center group cursor-pointer"
                                    >
                                        <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 overflow-hidden border-2 border-transparent group-hover:border-gold-accent transition-colors">
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaUser className="text-3xl" />
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold text-lg text-center">{writer.name}</h4>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stories */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Stories</h3>
                        {results.stories.length === 0 ? (
                            <p className="text-gray-400">No stories found.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {results.stories.map(story => (
                                    <div key={story.id} className="bg-[#1e1e1e] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors group relative">
                                        <div className="aspect-square bg-gray-800 rounded-md mb-4 overflow-hidden relative shadow-lg">
                                            {story.thumbnail_path ? (
                                                <img src={`http://localhost:5000${story.thumbnail_path}`} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">No Image</div>
                                            )}
                                            <button
                                                onClick={() => playStory(story)}
                                                className="absolute bottom-4 right-4 bg-gold-accent text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-110"
                                            >
                                                <FaPlay />
                                            </button>
                                        </div>
                                        <h4 className="text-white font-bold text-lg truncate">{story.title}</h4>
                                        <p className="text-sm text-gray-400 truncate">By {story.writer_name || 'Unknown'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {!query.trim() && (
                <div className="text-center text-gray-400 mt-12">
                    <p className="text-xl">Start typing to search...</p>
                </div>
            )}
        </div>
    );
};

export default Search;
