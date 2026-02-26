const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    console.log('Attempting to connect with:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD, // Be careful not to log real password in production logs
    });
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'subh06'
        });

        console.log('Connected to MySQL server');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} checked/created`);
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('DB Init Error:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Check username and password.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Connection refused. Is MySQL server running?');
        }
        process.exit(1);
    }
}

initDB();
