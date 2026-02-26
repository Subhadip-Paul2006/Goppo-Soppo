const db = require('./config/db');

const fs = require('fs');

async function listContent() {
    try {
        let output = "";

        output += "Searching for Playlists like 'Feluda'...\n";
        const [playlists] = await db.query('SELECT * FROM playlists WHERE title LIKE ?', ['%Feluda%']);
        playlists.forEach(p => output += `PLAYLIST: [${p.id}] "${p.title}" (Created: ${p.created_at})\n`);

        output += "\nSearching for Stories like 'Gantok' or 'Gangtok'...\n";
        const [stories] = await db.query('SELECT * FROM stories WHERE title LIKE ? OR title LIKE ?', ['%Gantok%', '%Gangtok%']);
        stories.forEach(s => output += `STORY:    [${s.id}] "${s.title}" (Created: ${s.created_at})\n`);

        fs.writeFileSync('content_list.txt', output);
        console.log("Written to content_list.txt");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

listContent();
