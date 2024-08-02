import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
       
        const token = req.cookies.jwt;

      
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access - No token provided" });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Unauthorized access - User not found" });
        }

     
        req.user = user;
        
       
        next();

    } catch (error) {
        console.error(error.message); 
        res.status(401).json({ error: "Unauthorized access - Invalid token" }); // Return 401 for unauthorized access
    }
};

export { protect };
