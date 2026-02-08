import IdempotencyKey from "../models/idempotencyKey.model.js";

const DEFAULT_TTL_MINUTES = 30;

export async function idempotencyMiddleware(req, res, next) {
    try {
        const key = req.header("Idempotency-Key");
        if (!key) return next();

        const storeId = req.user?.storeId || null;
        const userId = req.user?.id || null;
        const method = req.method;
        const path = req.baseUrl + req.path;

        const existing = await IdempotencyKey.findOne({
            key,
            method,
            path,
            storeId,
        }).lean();

        if (existing && existing.expiresAt > new Date()) {
            return res.status(existing.responseStatus || 200).json(existing.responseBody || {});
        }

        const originalJson = res.json.bind(res);
        res.json = async (body) => {
            try {
                const expiresAt = new Date(Date.now() + DEFAULT_TTL_MINUTES * 60 * 1000);
                await IdempotencyKey.findOneAndUpdate(
                    { key, method, path, storeId },
                    {
                        key,
                        method,
                        path,
                        storeId,
                        userId,
                        responseStatus: res.statusCode || 200,
                        responseBody: body,
                        expiresAt,
                    },
                    { upsert: true, new: true },
                );
            } catch (error) {
                console.error("Idempotency store error:", error);
            }
            return originalJson(body);
        };

        return next();
    } catch (error) {
        return next();
    }
}
