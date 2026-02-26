import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStory = () => {
    const [writers, setWriters] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', writer_id: '', genre: 'Detective', is_series: false
    });
    const [files, setFiles] = useState({ audio: null, thumbnail: null });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWriters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/writers', { withCredentials: true });
                setWriters(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWriters();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (files.audio) data.append('audio', files.audio);
        if (files.thumbnail) data.append('thumbnail', files.thumbnail);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/admin/stories', data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message);
            // Reset form could be here
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error uploading story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-detective-black p-6 rounded border border-gray-700 max-w-2xl">
            {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1">Story Title</label>
                    <input type="text" name="title" onChange={handleChange} required className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Writer</label>
                        <select name="writer_id" onChange={handleChange} required className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none">
                            <option value="">Select Writer</option>
                            {writers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Genre</label>
                        <select name="genre" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none">
                            <option>Detective</option>
                            <option>Drama</option>
                            <option>Horror</option>
                            <option>Suspense</option>
                            <option>Thriller</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea name="description" onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none h-24"></textarea>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_series" onChange={handleChange} id="series" className="w-4 h-4" />
                    <label htmlFor="series" className="text-gray-400 select-none cursor-pointer">Mark as New Series</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Audio File (.mp3)</label>
                        <input type="file" name="audio" accept=".mp3,audio/*" onChange={handleFileChange} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Thumbnail</label>
                        <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gold-accent text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50">
                    {loading ? 'Uploading...' : 'Publish Story'}
                </button>
            </form >
        </div >
    );
};

export default AddStory;
