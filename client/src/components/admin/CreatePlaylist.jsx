import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePlaylist = () => {
    const [stories, setStories] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', is_global: true, story_ids: []
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stories', { withCredentials: true });
                setStories(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStories();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleStorySelection = (e) => {
        const storyId = parseInt(e.target.value);
        if (e.target.checked) {
            setFormData({ ...formData, story_ids: [...formData.story_ids, storyId] });
        } else {
            setFormData({ ...formData, story_ids: formData.story_ids.filter(id => id !== storyId) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('is_global', formData.is_global);
            if (image) data.append('image', image);
            // Append story_ids properly (as JSON string or individual fields depending on backend expectation)
            // Backend expects req.body.story_ids but multer parses body differently. 
            // It's safer to loop or send as JSON. 
            // NOTE: express.json() middleware might not parse mixed Text/Multipart forms easily for arrays without specific handling.
            // Let's standardise on sending them as individual entries or handled in controller. 
            // Our controller logic: const { story_ids } = req.body;
            // with multer, array items often come as duplicate keys or require explicit parsing.
            // Let's send it as a JSON string and parse it in controller if needed, OR loop.
            // But wait, the controller expects `story_ids` array. 
            // For simplicity, let's append each one. 
            formData.story_ids.forEach(id => data.append('story_ids[]', id)); // Common pattern
            // Actually, if we look at controller: "if (story_ids && story_ids.length > 0)"
            // It expects an array. 

            // Let's try simple appending for now. 
            formData.story_ids.forEach(id => data.append('story_ids', id));

            const res = await axios.post('http://localhost:5000/api/admin/playlists', data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message);
            setFormData({ title: '', description: '', is_global: true, story_ids: [] });
            setImage(null);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Error creating playlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-detective-black p-6 rounded border border-gray-700 max-w-2xl">
            {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1">Playlist Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none" />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Cover Image</label>
                    <input type="file" onChange={handleImageChange} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-gray-300 focus:border-gold-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gold-accent hover:file:bg-gray-700 transition" />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none h-24"></textarea>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_global" checked={formData.is_global} onChange={handleChange} id="global" className="w-4 h-4" />
                    <label htmlFor="global" className="text-gray-400 select-none cursor-pointer">Global Playlist (Visible to Everyone)</label>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Add Stories</label>
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded max-h-60 overflow-y-auto space-y-2">
                        {stories.map(story => (
                            <div key={story.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={story.id}
                                    checked={formData.story_ids.includes(story.id)}
                                    onChange={handleStorySelection}
                                    id={`story-${story.id}`}
                                    className="w-4 h-4"
                                />
                                <label htmlFor={`story-${story.id}`} className="text-gray-300 cursor-pointer">{story.title}</label>
                            </div>
                        ))}
                        {stories.length === 0 && <p className="text-gray-500 text-sm">No stories available. Upload stories first.</p>}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gold-accent text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Playlist'}
                </button>
            </form>
        </div>
    );
};

export default CreatePlaylist;
