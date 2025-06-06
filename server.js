import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes and middleware



// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Parse JSON request bodies (for POST and PUT requests).
app.use(express.json());

// Routes
// Authentication routes (e.g., /api/auth/register, /api/auth/login)
// app.use('/api/auth', authRoutes);

// // Nuzlocke-specific routes (e.g., /api/nuzlocke/runs)
// // These routes are protected by the authenticateToken middleware,
// // ensuring that only authenticated users can access them.
// app.use('/api/nuzlocke', authenticateToken, nuzlockeRoutes);




// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // If MongoDB connection is successful, start the Express server
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        // Log any database connection errors and exit the process if connection fails
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit with a failure code
    });


