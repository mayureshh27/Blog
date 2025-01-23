import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // Check if token is present in cookies
        const token = req.cookies['token']; // Access the token from cookies
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing.Please Login' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        req.user = decoded; // Attach user data to request object
       
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

export default authMiddleware;
