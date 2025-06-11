import jwt from 'jsonwebtoken';

/**
 * @function authenticateToken
 * @desc Middleware to verify JWT token from Authorization header
 * and attach the user's ID to the request object (req.userId).
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Callback function to pass control to the next middleware
 */
export const authenticateToken = (req, res, next) => {
    // Get the Authorization header (e.g., "Bearer YOUR_TOKEN")
    const authHeader = req.headers['authorization'];
    // Extract the token (the part after "Bearer ")
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, send 401 (Unauthorized)
    if (!token) {
        return res.sendStatus(401);
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token verification fails (e.g., invalid, expired, tampered), send 403 (Forbidden)
        if (err) {
            // You could add more specific error logging here if needed
            // console.error('JWT verification error:', err);
            return res.sendStatus(403);
        }
        // If token is valid, attach the userId from the token payload to the request object
        // This makes the user's ID accessible in subsequent route handlers
        req.userId = user.userId;
        next(); // Pass control to the next middleware or route handler
    });
};