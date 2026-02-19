import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const globalForMongoose = globalThis;
const cached = globalForMongoose.__mongooseCache || {
    conn: null,
    promise: null,
};

globalForMongoose.__mongooseCache = cached;

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const mongoUri = process.env.MONGODB_URL?.trim();
        if (!mongoUri) {
            throw new Error("MONGODB_URL is not defined");
        }

        cached.promise = mongoose
            .connect(mongoUri, {
                dbName: process.env.MONGODB_DB_NAME || "vyapaarsetu",
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
                minPoolSize: 1,
                family: 4,
            })
            .then((mongooseInstance) => {
                console.log("MongoDB is running!");
                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
