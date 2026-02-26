const pool = require('../config/db');

exports.toggleLike = async (req, res) => {
    const userId = req.session.user?.id;
    const { storyId } = req.body;

    if (!userId || !storyId) return res.status(400).json({ error: 'Missing requirements' });

    try {
        // Check if already liked
        const [existing] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND story_id = ?', [userId, storyId]);

        let isLiked = false;

        if (existing.length > 0) {
            // Unlike
            await pool.query('DELETE FROM likes WHERE user_id = ? AND story_id = ?', [userId, storyId]);
            isLiked = false;
        } else {
            // Like
            await pool.query('INSERT INTO likes (user_id, story_id) VALUES (?, ?)', [userId, storyId]);
            isLiked = true;
        }

        // Get new count
        const [likes] = await pool.query('SELECT COUNT(*) as count FROM likes WHERE story_id = ?', [storyId]);
        res.json({ liked: isLiked, count: likes[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLibrary = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const [likedStories] = await pool.query(`
            SELECT s.*, w.name as writer_name 
            FROM stories s 
            JOIN likes l ON s.id = l.story_id 
            LEFT JOIN writers w ON s.writer_id = w.id
            WHERE l.user_id = ?
            ORDER BY l.created_at DESC
        `, [userId]);

        res.json({ liked: likedStories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
