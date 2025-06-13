import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user-temp.js'; // capitalize 'User' to match the model export

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation: Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken.' });
        }

        // Create a new user instance and save it
        const newUser = new User({ username, password }); // Password will be hashed by pre-save hook
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err); // Log the error for server-side debugging
        res.status(500).json({ error: 'Server error during registration.', details: err.message });
    }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get JWT token in HTTP-only cookie
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        console.log('Login attempt for:', username);
        console.log('User found:', user);

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials (user not found).' });
        }

        // Log the plain password and the hashed password
        console.log('Plain password:', password);
        console.log('Hashed password from DB:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials (password mismatch).' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Set token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 2 * 60 * 60 * 1000
        });

        // Send user info back to the client (token not required in body)
        res.json({
            user: {
                username: user.username,
                id: user._id
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login.', details: err.message });
    }
});

/**
 * @route POST /api/auth/logout
 * @desc Clear JWT cookie
 * @access Public
 */
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

export default router;