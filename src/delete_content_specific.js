const db = require('./config/db');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const deleteFile = (dbPath) => {
    if (!dbPath) return;
    const relativePath = dbPath.startsWith('/') ? dbPath.slice(1) : dbPath;
    const fullPath = path.join(rootDir, relativePath);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
    } else {
        console.log(`File not found, skipping: ${fullPath}`);
    }
};

async function deleteSpecificContent() {
    try {
        console.log("Starting deletion process...");

        // 1. Delete Story ID 40 (Gangtok-e Gondogol)
        const storyId = 40;
        const [storyRows] = await db.query('SELECT * FROM stories WHERE id = ?', [storyId]);
        if (storyRows.length > 0) {
            const story = storyRows[0];
            console.log(`Deleting Story: "${story.title}" (ID: ${story.id})`);
            deleteFile(story.audio_path);
            deleteFile(story.thumbnail_path);
            await db.query('DELETE FROM stories WHERE id = ?', [story.id]);
            console.log("Story deleted from DB.");
        } else {
            console.log(`Story ID ${storyId} not found.`);
        }

        // 2. Delete Playlist ID 1 (Feluda)
        // Also need to delete entries in playlist_items (usually cascade or manual)
        // Check triggers or constraints? Assuming manual cleanup for safety or foreign keys handle it.
        // Let's safe delete items first.
        const playlistId = 1;
        const [playlistRows] = await db.query('SELECT * FROM playlists WHERE id = ?', [playlistId]);
        if (playlistRows.length > 0) {
            const playlist = playlistRows[0];
            console.log(`Deleting Playlist: "${playlist.title}" (ID: ${playlist.id})`);

            // Delete associated file if any
            if (playlist.thumbnail_path) {
                deleteFile(playlist.thumbnail_path);
            }

            // Remove items
            await db.query('DELETE FROM playlist_items WHERE playlist_id = ?', [playlistId]);
            console.log("Playlist items cleared.");

            // Remove playlist
            await db.query('DELETE FROM playlists WHERE id = ?', [playlistId]);
            console.log("Playlist deleted from DB.");
        } else {
            console.log(`Playlist ID ${playlistId} not found.`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

deleteSpecificContent();
