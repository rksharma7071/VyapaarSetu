import express from "express";
import {
    handleGetAllUsers,
    handleCreateNewUser,
    handleGetUserUinsgId,
    handleUpdateUserUsingId,
    handleDeleteUserUsingId,
    handleUpdatePermission,
    handleGetPermissionUsingId,
    handleAllPermission,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").get(authMiddleware, handleGetAllUsers).post(authMiddleware, handleCreateNewUser);

router
    .route("/permission")
    .get(authMiddleware, handleAllPermission)
    .post(authMiddleware, handleUpdatePermission);

router
    .route("/permission/:id")
    .get(authMiddleware, handleGetPermissionUsingId)
    .patch(authMiddleware, handleUpdatePermission);

router
    .route("/:id")
    .get(authMiddleware, handleGetUserUinsgId)
    .patch(authMiddleware, handleUpdateUserUsingId)
    .delete(authMiddleware, handleDeleteUserUsingId);

export default router;
