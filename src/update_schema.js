const db = require('./config/db');

async function updateSchema() {
    try {
        console.log("Checking playlists table...");
        const [columns] = await db.query('SHOW COLUMNS FROM playlists LIKE "thumbnail_path"');

        if (columns.length === 0) {
            console.log("Adding thumbnail_path column to playlists table...");
            await db.query('ALTER TABLE playlists ADD COLUMN thumbnail_path VARCHAR(255) DEFAULT NULL');
            console.log("Column added successfully.");
        } else {
            console.log("Column thumbnail_path already exists.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error updating schema:", err);
        process.exit(1);
    }
}

updateSchema();
