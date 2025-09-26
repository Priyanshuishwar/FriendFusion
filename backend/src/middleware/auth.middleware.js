import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Find user by ID stored in JWT payload
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Attach user object to request for use in routes
        req.user = user;

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
