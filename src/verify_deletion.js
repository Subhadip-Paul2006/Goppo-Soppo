const db = require('./config/db');

async function verifyDeletion() {
    try {
        const [rows] = await db.query('SELECT * FROM playlists WHERE id = 1');
        const [stories] = await db.query('SELECT * FROM stories WHERE id = 40');

        if (rows.length === 0 && stories.length === 0) {
            console.log("VERIFICATION SUCCESS: Playlist 1 and Story 40 are gone.");
        } else {
            console.log("VERIFICATION FAILED: Some items remain.");
            if (rows.length > 0) console.log("Playlist 1 exists");
            if (stories.length > 0) console.log("Story 40 exists");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyDeletion();
