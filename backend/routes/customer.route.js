import express from "express";
import {
    createCustomer,
    deleteCustomer,
    getCustomer,
    getCustomerByID_Mobile,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.route("/").get(getCustomer).post(createCustomer);

router.route("/:id").get(getCustomerByID_Mobile).delete(deleteCustomer);

export default router;
