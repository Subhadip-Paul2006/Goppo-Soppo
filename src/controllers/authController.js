const db = require('../config/db');
const bcrypt = require('bcrypt');
const { sendOTP } = require('../config/email');

// Generate numeric OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    const { name, email, password, dob, gender, preferred_genre } = req.body;

    try {
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (unverified)
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, dob, gender, preferred_genre, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, dob, gender, preferred_genre, false]
        );

        const userId = result.insertId;
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save OTP
        await db.query('INSERT INTO otps (user_id, otp_hash, expires_at) VALUES (?, ?, ?)', [userId, otpHash, expiresAt]);

        // Send Email
        const emailSent = await sendOTP(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Error sending OTP' });
        }

        res.status(201).json({ message: 'User registered. Please verify OTP.', userId, email });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const [otps] = await db.query('SELECT * FROM otps WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1', [userId]);

        if (otps.length === 0) return res.status(400).json({ message: 'OTP not found' });

        const latestOtp = otps[0];
        if (new Date() > new Date(latestOtp.expires_at)) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const isValid = await bcrypt.compare(otp, latestOtp.otp_hash);
        if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

        // Mark user verified
        await db.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);
        await db.query('DELETE FROM otps WHERE user_id = ?', [userId]);

        // Auto-login (Create Session)
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        req.session.user = { id: user[0].id, role: user[0].role, name: user[0].name };

        res.json({ message: 'Verification successful', user: req.session.user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.is_verified) return res.status(403).json({ message: 'Email not verified', userId: user.id });

        req.session.user = { id: user.id, role: user.role, name: user.name };
        res.json({ message: 'Login successful', user: req.session.user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
};

exports.checkAuth = (req, res) => {
    if (req.session.user) {
        res.json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.json({ isAuthenticated: false });
    }
};
