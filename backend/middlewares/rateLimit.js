const windows = new Map();

export default function rateLimit({ windowMs = 600000, max = 20 } = {}) {
    return (req, res, next) => {
        const key = `${req.ip}:${req.originalUrl}`;
        const now = Date.now();
        const entry = windows.get(key) || { count: 0, resetAt: now + windowMs };

        if (now > entry.resetAt) {
            entry.count = 0;
            entry.resetAt = now + windowMs;
        }

        entry.count += 1;
        windows.set(key, entry);

        res.setHeader("X-RateLimit-Limit", String(max));
        res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));
        res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

        if (entry.count > max) {
            return res.status(429).json({ message: "Too many requests" });
        }
        return next();
    };
}
