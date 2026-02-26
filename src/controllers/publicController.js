const db = require('../config/db');

exports.getHomeData = async (req, res) => {
    try {
        // 1. Hero: Latest Story
        const [latestStory] = await db.query(`
            SELECT s.*, w.name AS writer_name 
            FROM stories s 
            LEFT JOIN writers w ON s.writer_id = w.id 
            ORDER BY s.created_at DESC LIMIT 1
        `);

        // 2. Trending Stories (Random for now, or by likes later)
        const [trendingStories] = await db.query(`
            SELECT s.*, w.name AS writer_name 
            FROM stories s 
            LEFT JOIN writers w ON s.writer_id = w.id 
            ORDER BY RAND() LIMIT 5
        `);

        // 3. Detective Stories
        const [detectiveStories] = await db.query(`
            SELECT s.*, w.name AS writer_name 
            FROM stories s 
            LEFT JOIN writers w ON s.writer_id = w.id 
            WHERE s.genre = "Detective" 
            ORDER BY s.created_at DESC LIMIT 5
        `);

        // 4. Writers
        const [writers] = await db.query('SELECT * FROM writers ORDER BY RAND() LIMIT 5');

        // 5. Global Playlists
        const [playlists] = await db.query('SELECT * FROM playlists WHERE is_global = TRUE ORDER BY created_at DESC LIMIT 5');

        res.json({
            hero: latestStory[0] || null,
            trending: trendingStories,
            detective: detectiveStories,
            writers: writers,
            playlists: playlists
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching home data' });
    }
};

exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ stories: [], writers: [] });

        const [stories] = await db.query(`
            SELECT s.*, w.name AS writer_name 
            FROM stories s 
            LEFT JOIN writers w ON s.writer_id = w.id 
            WHERE s.title LIKE ? OR s.description LIKE ?
        `, [`%${q}%`, `%${q}%`]);
        const [writers] = await db.query('SELECT * FROM writers WHERE name LIKE ?', [`%${q}%`]);

        res.json({ stories, writers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during search' });
    }
};

exports.getAllGenres = async (req, res) => {
    try {
        const [genres] = await db.query('SELECT DISTINCT genre FROM stories WHERE genre IS NOT NULL AND genre != ""');
        res.json(genres.map(g => g.genre));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching genres' });
    }
};

exports.getWriterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [writers] = await db.query('SELECT * FROM writers WHERE id = ?', [id]);

        if (writers.length === 0) {
            return res.status(404).json({ message: 'Writer not found' });
        }

        const writer = writers[0];

        // Fetch stories by this writer
        const [stories] = await db.query(`
            SELECT s.*, w.name AS writer_name 
            FROM stories s 
            LEFT JOIN writers w ON s.writer_id = w.id 
            WHERE s.writer_id = ? 
            ORDER BY s.created_at DESC
        `, [id]);

        res.json({ writer, stories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching writer details' });
    }
};

exports.getStoryMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user?.id;

        // Get like count
        const [likes] = await db.query('SELECT COUNT(*) as count FROM likes WHERE story_id = ?', [id]);
        const count = likes[0].count;

        let isLiked = false;
        if (userId) {
            const [userLike] = await db.query('SELECT * FROM likes WHERE user_id = ? AND story_id = ?', [userId, id]);
            isLiked = userLike.length > 0;
        }

        res.json({ count, isLiked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching story meta' });
    }
};
