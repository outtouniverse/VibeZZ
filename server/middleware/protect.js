import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        console.log('Received Token:', token); 

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: "Unauthorized access - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); 

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: "Unauthorized access - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message); 
        res.status(401).json({ error: "Unauthorized access - Invalid token" });
    }
};


export { protect };
