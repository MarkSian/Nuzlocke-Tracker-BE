import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // Import the User model

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Basic validation: Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken.' });
        }
        // If email is unique and not sparse, you might check for existing email too
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already registered.' });
            }
        }


        // Create a new user instance and save it
        const newUser = new User({ username, password, email }); // Password will be hashed by pre-save hook
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err); // Log the error for server-side debugging
        res.status(500).json({ error: 'Server error during registration.', details: err.message });
    }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get JWT token
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
            { userId: user._id }, // Payload: user ID
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '2h' } // Token expires in 2 hours
        );

        // Send token and basic user info back to the client
        res.json({
            token,
            user: {
                username: user.username,
                id: user._id
            }
        });
    } catch (err) {
        console.error('Login error:', err); // Log the error
        res.status(500).json({ error: 'Server error during login.', details: err.message });
    }
});

export default router;