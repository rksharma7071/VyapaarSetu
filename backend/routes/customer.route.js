import express from "express";
import {
    createCustomer,
    deleteCustomer,
    getCustomer,
    getCustomerByID_Mobile,
} from "../controllers/customer.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readCustomer"), getCustomer)
    .post(authMiddleware, authorizePermission("createCustomer"), createCustomer);

router
    .route("/:id")
    .get(
        authMiddleware,
        authorizePermission("readCustomer"),
        getCustomerByID_Mobile,
    )
    .delete(authMiddleware, authorizePermission("deleteCustomer"), deleteCustomer);

export default router;
