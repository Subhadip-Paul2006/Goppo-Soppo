import React, { useState } from 'react';
import axios from 'axios';

const AddWriter = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return setMessage('Name is required');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        if (image) formData.append('image', image);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/admin/writers', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message);
            setName('');
            setBio('');
            setImage(null);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error adding writer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-detective-black p-6 rounded border border-gray-700 max-w-2xl">
            {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1">Writer Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Bio / Description</label>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white focus:border-gold-accent outline-none h-32"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Writer Image</label>
                    <input
                        type="file"
                        onChange={e => setImage(e.target.files[0])}
                        accept="image/*"
                        className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold-accent file:text-black hover:file:bg-yellow-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gold-accent text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Add Writer'}
                </button>
            </form>
        </div>
    );
};

export default AddWriter;
