import express from "express";
import {
    createStore,
    deleteStore,
    getStoreById,
    getStores,
    updateStore,
    activateSubscription,
} from "../controllers/store.controller.js";
import authMiddleware from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").get(authMiddleware, getStores).post(authMiddleware, createStore);
router
    .route("/:id")
    .get(authMiddleware, getStoreById)
    .patch(authMiddleware, updateStore)
    .delete(authMiddleware, deleteStore);
router.route("/:id/subscribe").post(authMiddleware, activateSubscription);

export default router;
