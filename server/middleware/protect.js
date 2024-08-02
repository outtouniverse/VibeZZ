const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log('Token:', token); // Log token for debugging

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log decoded token

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Unauthorized access - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error:', error.message); // Log error for debugging
        res.status(401).json({ error: "Unauthorized access - Invalid token" });
    }
};
