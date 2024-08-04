import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log('Token:', token); 

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: "Unauthorized access - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log decoded token

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: "Unauthorized access - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error:', error.message); // Log error for debugging
        res.status(401).json({ error: "Unauthorized access - Invalid token" });
    }
};

export { protect };
