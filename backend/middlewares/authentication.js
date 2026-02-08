import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Store from "../models/store.model.js";

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
            .select("_id role storeId isActive sessionId")
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }
                if (user.isActive === false) {
                    return res.status(403).json({ message: "Account deactivated" });
                }
                if (decoded.sid && user.sessionId && decoded.sid !== user.sessionId) {
                    return res.status(401).json({ message: "Session expired" });
                }
                req.user.storeId = user.storeId || null;
                req.user.role = user.role;
                if (!user.storeId) return next();
                return Store.findById(user.storeId)
                    .select("isActive subscriptionStatus subscriptionEnd")
                    .then((store) => {
                        if (!store || store.isActive === false) {
                            return res.status(403).json({ message: "Store suspended" });
                        }
                        return next();
                    });
            });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
