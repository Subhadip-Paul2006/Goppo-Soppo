const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
    const userId = req.session.user?.id;
    const { title, description, privacy } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Playlist name is required' });
    }

    try {
        // Handle cover image if uploaded
        let coverImagePath = null;
        if (req.file) {
            coverImagePath = `/uploads/playlists/${req.file.filename}`;
        }

        const [result] = await pool.query(
            `INSERT INTO playlists (user_id, title, description, cover_image, privacy) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, title.trim(), description || null, coverImagePath, privacy || 'private']
        );

        const playlistId = result.insertId;

        res.status(201).json({
            message: 'Playlist created successfully',
            playlist: {
                id: playlistId,
                user_id: userId,
                title: title.trim(),
                description: description || null,
                cover_image: coverImagePath,
                privacy: privacy || 'private'
            }
        });
    } catch (err) {
        console.error('Create playlist error:', err);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

// Get all playlists for the authenticated user
exports.getUserPlaylists = async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const [playlists] = await pool.query(
            `SELECT p.*, 
                    (SELECT COUNT(*) FROM playlist_items pi WHERE pi.playlist_id = p.id) as item_count
             FROM playlists p 
             WHERE p.user_id = ? 
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json({ playlists });
    } catch (err) {
        console.error('Get user playlists error:', err);
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
};

// Get a single playlist by ID with its items
exports.getPlaylistById = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user?.id;

    try {
        const [playlists] = await pool.query(
            `SELECT p.*, u.name as owner_name 
             FROM playlists p 
             LEFT JOIN users u ON p.user_id = u.id
             WHERE p.id = ?`,
            [id]
        );

        if (playlists.length === 0) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const playlist = playlists[0];

        // Check if private and not owner
        if (playlist.privacy === 'private' && playlist.user_id !== userId) {
            return res.status(403).json({ error: 'This playlist is private' });
        }

        // Get playlist items (stories)
        const [items] = await pool.query(
            `SELECT s.*, w.name as writer_name, pi.added_at
             FROM playlist_items pi
             JOIN stories s ON pi.story_id = s.id
             LEFT JOIN writers w ON s.writer_id = w.id
             WHERE pi.playlist_id = ?
             ORDER BY pi.added_at DESC`,
            [id]
        );

        playlist.items = items;
        playlist.isOwner = playlist.user_id === userId;

        res.json({ playlist });
    } catch (err) {
        console.error('Get playlist by ID error:', err);
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
};

// Update a playlist
exports.updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user?.id;
    const { title, description, privacy } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify ownership
        const [existing] = await pool.query(
            'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Playlist not found or access denied' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({ error: 'Playlist name cannot be empty' });
            }
            updates.push('title = ?');
            values.push(title.trim());
        }

        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }

        if (privacy !== undefined) {
            updates.push('privacy = ?');
            values.push(privacy);
        }

        if (req.file) {
            const coverImagePath = `/uploads/playlists/${req.file.filename}`;
            updates.push('cover_image = ?');
            values.push(coverImagePath);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await pool.query(
            `UPDATE playlists SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Playlist updated successfully' });
    } catch (err) {
        console.error('Update playlist error:', err);
        res.status(500).json({ error: 'Failed to update playlist' });
    }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify ownership
        const [existing] = await pool.query(
            'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Playlist not found or access denied' });
        }

        await pool.query('DELETE FROM playlists WHERE id = ?', [id]);

        res.json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        console.error('Delete playlist error:', err);
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
};

// Add a story to a playlist
exports.addToPlaylist = async (req, res) => {
    const { id } = req.params;
    const { storyId } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
    }

    try {
        // Verify playlist ownership
        const [playlist] = await pool.query(
            'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (playlist.length === 0) {
            return res.status(404).json({ error: 'Playlist not found or access denied' });
        }

        // Check if story exists
        const [story] = await pool.query('SELECT id FROM stories WHERE id = ?', [storyId]);
        if (story.length === 0) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Check if already in playlist
        const [existing] = await pool.query(
            'SELECT * FROM playlist_items WHERE playlist_id = ? AND story_id = ?',
            [id, storyId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Story already in playlist' });
        }

        await pool.query(
            'INSERT INTO playlist_items (playlist_id, story_id) VALUES (?, ?)',
            [id, storyId]
        );

        res.status(201).json({ message: 'Story added to playlist' });
    } catch (err) {
        console.error('Add to playlist error:', err);
        res.status(500).json({ error: 'Failed to add story to playlist' });
    }
};

// Remove a story from a playlist
exports.removeFromPlaylist = async (req, res) => {
    const { id, storyId } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify playlist ownership
        const [playlist] = await pool.query(
            'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (playlist.length === 0) {
            return res.status(404).json({ error: 'Playlist not found or access denied' });
        }

        await pool.query(
            'DELETE FROM playlist_items WHERE playlist_id = ? AND story_id = ?',
            [id, storyId]
        );

        res.json({ message: 'Story removed from playlist' });
    } catch (err) {
        console.error('Remove from playlist error:', err);
        res.status(500).json({ error: 'Failed to remove story from playlist' });
    }
};
