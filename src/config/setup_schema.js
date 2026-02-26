const pool = require('./db');
const bcrypt = require('bcrypt');

async function setupSchema() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected for Schema Setup');

        // Create Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255), -- Nullable for now, but used for Admin
                dob DATE,
                gender ENUM('Male', 'Female', 'Other'),
                preferred_genre VARCHAR(255),
                is_verified BOOLEAN DEFAULT FALSE,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created');

        // Create OTPs Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS otps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                otp_hash VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('OTPs table checked/created');

        // Create Writers Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS writers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                bio TEXT,
                image_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Writers table checked/created');

        // Create Stories Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS stories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                writer_id INT,
                genre VARCHAR(255),
                audio_path VARCHAR(255) NOT NULL,
                thumbnail_path VARCHAR(255),
                is_series BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (writer_id) REFERENCES writers(id) ON DELETE SET NULL
            )
        `);
        console.log('Stories table checked/created');

        // Create Playlists Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS playlists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                cover_image VARCHAR(255),
                privacy ENUM('public', 'private') DEFAULT 'private',
                is_global BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Playlists table checked/created');

        // Create Playlist Items Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS playlist_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                playlist_id INT NOT NULL,
                story_id INT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
            )
        `);
        console.log('Playlist Items table checked/created');

        // Create Likes Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                story_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
                UNIQUE(user_id, story_id)
            )
        `);
        console.log('Likes table checked/created');

        // Seed Admin User
        const adminEmail = 'subhadippaulff@gmail.com';
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            await connection.query(`
                INSERT INTO users (name, email, password, role, is_verified)
                VALUES (?, ?, ?, 'admin', TRUE)
            `, ['Admin', adminEmail, hashedPassword]);
            console.log('Admin user seeded successfully');
        } else {
            console.log('Admin user already exists');
        }

        connection.release();
        process.exit(0);

    } catch (err) {
        console.error('Schema Setup Error:', err);
        process.exit(1);
    }
}

setupSchema();
