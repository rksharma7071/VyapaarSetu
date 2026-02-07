import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return User.findById(decoded.id)
            .select("_id role storeId")
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }
                req.user.storeId = user.storeId || null;
                req.user.role = user.role;
                return next();
            });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
