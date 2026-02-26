import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaHeart, FaMusic, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import StoryModal from '../components/StoryModal';

const SliderSection = ({ title, children }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-6 md:mb-8 relative group">
            <div className="flex justify-between items-end mb-3 md:mb-4 px-1 md:px-2">
                <h2 className="text-xl md:text-2xl font-serif text-white border-l-4 border-gold-accent pl-2 md:pl-3 text-shadow hover:underline cursor-pointer">{title}</h2>
                <a href="#" className="text-xs md:text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors">Show All</a>
            </div>

            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110 transition-all duration-300 backdrop-blur-sm -ml-4 shadow-2xl border border-gray-700 hidden md:block"
                >
                    <FaChevronLeft />
                </button>

                {/* Slider Container */}
                <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x px-2">
                    {children}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110 transition-all duration-300 backdrop-blur-sm -mr-4 shadow-2xl border border-gray-700 hidden md:block"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

const Card = ({ title, subtitle, image, onClick }) => (
    <div onClick={onClick} className="min-w-[160px] w-[160px] md:min-w-[280px] md:w-[280px] bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-lg snap-start">
        <div className="aspect-square md:aspect-video bg-black rounded-md mb-3 md:mb-4 overflow-hidden relative shadow-md">
            {image ? (
                <img src={`http://localhost:5000${image}`} alt={title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-600">
                    <FaMusic className="text-2xl md:text-4xl opacity-20" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="bg-gold-accent text-black p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-110 transition-transform duration-300">
                    <FaPlay className="pl-1 text-xl" />
                </div>
            </div>
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1 line-clamp-2 leading-tight">{title}</h3>
        <p className="text-xs md:text-sm text-gray-400 font-medium line-clamp-1">{subtitle}</p>
    </div>
);

const Home = () => {
    const [data, setData] = useState({ hero: null, trending: [], detective: [], writers: [], playlists: [] });
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);
    const { playStory } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/home');
                console.log('Home data received:', res.data);
                setData(res.data);
            } catch (err) {
                console.error('Error fetching home data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">Loading Archives...</div>;

    const { hero, trending, detective, writers, playlists } = data;

    // Debug log
    console.log('Rendering with:', { hero: !!hero, trendingCount: trending?.length, detectiveCount: detective?.length });


    return (
        <div className="p-4 md:p-8">
            {/* Modal */}
            <StoryModal
                story={selectedStory}
                onClose={() => setSelectedStory(null)}
                onPlay={playStory}
            />

            {/* Hero Section */}
            {hero && (
                <div className="relative h-[60vh] md:h-96 rounded-2xl overflow-hidden mb-8 md:mb-12 bg-gradient-to-r from-black via-detective-black to-transparent border border-gray-800">
                    <div className="absolute inset-0 z-0 opacity-50 md:opacity-100">
                        {hero.thumbnail_path && <img src={`http://localhost:5000${hero.thumbnail_path}`} className="w-full h-full object-cover" alt="Hero" />}
                    </div>
                    <div className="absolute inset-0 z-0 bg-black/60 md:hidden" />
                    <div className="relative z-10 p-6 md:p-12 flex flex-col justify-end md:justify-center h-full w-full md:max-w-2xl bg-gradient-to-t md:bg-gradient-to-r from-black/90 to-transparent">
                        <span className="text-gold-accent font-bold tracking-widest mb-2 uppercase text-xs md:text-sm">Latest Release</span>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-4 leading-tight">{hero.title}</h1>
                        <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">{hero.description}</p>
                        <div className="flex flex-wrap gap-3 md:gap-4">
                            <button onClick={() => playStory(hero)} className="bg-gold-accent text-black px-6 md:px-8 py-2 md:py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform text-sm md:text-base cursor-pointer">
                                <FaPlay /> Listen Now
                            </button>
                            <button onClick={() => setSelectedStory(hero)} className="border border-gray-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-white/10 transition-colors text-sm md:text-base cursor-pointer">
                                More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trending */}
            {trending.length > 0 && (
                <SliderSection title="Trending Files">
                    {trending.map(s => (
                        <Card key={s.id} title={s.title} subtitle={s.writer_name || s.genre} image={s.thumbnail_path} onClick={() => setSelectedStory(s)} />
                    ))}
                </SliderSection>
            )}

            {/* Global Playlists */}
            {playlists.length > 0 && (
                <SliderSection title="Curated Collections">
                    {playlists.map(p => (
                        <Card key={p.id} title={p.title} subtitle={p.description} image={p.thumbnail_path} onClick={() => setSelectedStory(p)} />
                    ))}
                </SliderSection>
            )}

            {/* Detective Stories */}
            {detective.length > 0 && (
                <SliderSection title="Detective Chronicles">
                    {detective.map(s => (
                        <Card key={s.id} title={s.title} subtitle={s.writer_name || "Detective"} image={s.thumbnail_path} onClick={() => setSelectedStory(s)} />
                    ))}
                </SliderSection>
            )}

            {/* Explore Writers */}
            {writers.length > 0 && (
                <SliderSection title="Top Authors">
                    {writers.map(w => (
                        <div key={w.id} className="text-center group cursor-pointer min-w-[100px] md:min-w-[150px] snap-start" onClick={() => window.location.href = `/writer/${w.id}`}>
                            <div className="w-20 h-20 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-gold-accent mb-2 md:mb-3 transition-colors">
                                {w.image_path ? (
                                    <img src={`http://localhost:5000${w.image_path}`} alt={w.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xl md:text-2xl font-serif">{w.name[0]}</div>
                                )}
                            </div>
                            <h3 className="font-bold text-white group-hover:text-gold-accent transition-colors">{w.name}</h3>
                        </div>
                    ))}
                </SliderSection>
            )}

            {(!hero && trending.length === 0 && detective.length === 0) && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="bg-gray-800/50 p-6 md:p-12 rounded-2xl border border-gray-700 max-w-lg backdrop-blur-sm">
                        <h2 className="text-2xl md:text-4xl font-serif text-white mb-4 md:mb-6">The Archives are Empty</h2>
                        <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-8">No cases found in the database. You need to log in as an Admin to upload the first story.</p>
                        <a href="/login" className="inline-block bg-gold-accent text-black px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-transform">
                            Login as Admin
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
