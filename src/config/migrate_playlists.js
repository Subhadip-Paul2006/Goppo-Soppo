/**
 * Migration script to add user_id, cover_image, and privacy fields to playlists table
 * Run this script once to update the existing schema:
 * node src/config/migrate_playlists.js
 */

const pool = require('./db');

async function migratePlaylists() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected for Playlists Migration');

        // Check if user_id column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'goppo_soppo' AND TABLE_NAME = 'playlists'
        `);

        const columnNames = columns.map(c => c.COLUMN_NAME);

        // Add user_id if not exists
        if (!columnNames.includes('user_id')) {
            console.log('Adding user_id column...');
            await connection.query(`
                ALTER TABLE playlists 
                ADD COLUMN user_id INT AFTER id
            `);
            // Note: We can't add NOT NULL and FK if there are existing rows without user_id
            // For fresh installs, you can add the FK constraint
            console.log('user_id column added');
        } else {
            console.log('user_id column already exists');
        }

        // Add cover_image if not exists
        if (!columnNames.includes('cover_image')) {
            console.log('Adding cover_image column...');
            await connection.query(`
                ALTER TABLE playlists 
                ADD COLUMN cover_image VARCHAR(255) AFTER description
            `);
            console.log('cover_image column added');
        } else {
            console.log('cover_image column already exists');
        }

        // Add privacy if not exists
        if (!columnNames.includes('privacy')) {
            console.log('Adding privacy column...');
            await connection.query(`
                ALTER TABLE playlists 
                ADD COLUMN privacy ENUM('public', 'private') DEFAULT 'private' AFTER cover_image
            `);
            console.log('privacy column added');
        } else {
            console.log('privacy column already exists');
        }

        // Try to add foreign key (will fail silently if already exists)
        try {
            await connection.query(`
                ALTER TABLE playlists 
                ADD CONSTRAINT fk_playlist_user 
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            `);
            console.log('Foreign key added for user_id');
        } catch (fkError) {
            if (fkError.code === 'ER_DUP_KEYNAME' || fkError.code === 'ER_FK_DUP_NAME') {
                console.log('Foreign key already exists');
            } else {
                console.log('Foreign key note:', fkError.message);
            }
        }

        console.log('Migration completed successfully!');
        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Migration Error:', err);
        process.exit(1);
    }
}

migratePlaylists();
