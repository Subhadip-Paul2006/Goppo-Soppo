const db = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.addWriter = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const imagePath = req.file ? `/uploads/writers/${req.file.filename}` : null;

        if (!name) {
            return res.status(400).json({ message: 'Writer name is required' });
        }

        const [result] = await db.query(
            'INSERT INTO writers (name, bio, image_path) VALUES (?, ?, ?)',
            [name, bio, imagePath]
        );

        res.status(201).json({ message: 'Writer added successfully', writerId: result.insertId, imagePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding writer' });
    }
};

exports.getWriters = async (req, res) => {
    try {
        const [writers] = await db.query('SELECT * FROM writers ORDER BY name ASC');
        res.json(writers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching writers' });
    }
};

exports.addStory = async (req, res) => {
    try {
        const { title, description, writer_id, genre, is_series } = req.body;

        const audioPath = req.files['audio'] ? `/audio/${req.files['audio'][0].filename}` : null;
        const thumbnailPath = req.files['thumbnail'] ? `/uploads/thumbnails/${req.files['thumbnail'][0].filename}` : null;

        if (!title || !writer_id || !audioPath) {
            return res.status(400).json({ message: 'Title, Writer, and Audio are required' });
        }

        const [result] = await db.query(
            'INSERT INTO stories (title, description, writer_id, genre, audio_path, thumbnail_path, is_series) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, writer_id, genre, audioPath, thumbnailPath, is_series === 'true']
        );

        res.status(201).json({ message: 'Story uploaded successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding story' });
    }
};

exports.getStories = async (req, res) => {
    try {
        const [stories] = await db.query('SELECT id, title FROM stories ORDER BY title ASC');
        res.json(stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching stories' });
    }
};

exports.createPlaylist = async (req, res) => {
    try {
        let { title, description, is_global, story_ids } = req.body;
        const thumbnailPath = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

        if (!title) return res.status(400).json({ message: 'Title is required' });

        // Parse boolean from string if needed (FormData sends strings)
        const isGlobalBool = is_global === 'true' || is_global === true || is_global === 1 || is_global === '1';

        // Create Playlist
        const [playlistResult] = await db.query(
            'INSERT INTO playlists (title, description, is_global, thumbnail_path) VALUES (?, ?, ?, ?)',
            [title, description, isGlobalBool, thumbnailPath]
        );

        const playlistId = playlistResult.insertId;

        // Add Items
        // Determine if story_ids is strictly an array or single value
        if (story_ids) {
            // Ensure array
            const ids = Array.isArray(story_ids) ? story_ids : [story_ids];
            if (ids.length > 0) {
                const values = ids.map(storyId => [playlistId, parseInt(storyId)]);
                await db.query('INSERT INTO playlist_items (playlist_id, story_id) VALUES ?', [values]);
            }
        }

        res.status(201).json({ message: 'Playlist created successfully', playlistId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating playlist' });
    }
};

exports.getPlaylists = async (req, res) => {
    try {
        // Fetch all playlists (admin might want to see all, but dashboard specifically asks for Global. 
        // Let's return all and let frontend filter or just return global if that's the only metric.)
        // User screenshot shows "Global Playlists".
        // Let's return all, it's more versatile.
        const [playlists] = await db.query('SELECT * FROM playlists ORDER BY created_at DESC');
        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching playlists' });
    }
};
