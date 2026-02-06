import mongoose from "mongoose";
import Customer from "../models/customer.model.js";

export const getCustomer = async (req, res) => {
    try {
        const customers = await Customer.find()
            .select("_id name phone createdAt")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: customers.length,
            data: customers,
        });
    } catch (error) {
        console.error("Get customers error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
};

export const getCustomerByID_Mobile = async (req, res) => {
    try {
        const { id } = req.params;

        let query = { isActive: true };

        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.phone = id;
        }

        const customer = await Customer.findOne(query).select(
            "_id name phone email createdAt",
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("Get customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and phone number are required",
            });
        }

        let customer = await Customer.findOne({ phone, role: "customer" });

        if (customer) {
            customer.name = name;
            await customer.save();

            return res.status(200).json({
                success: true,
                message: "Customer updated",
                data: customer,
            });
        }

        customer = await Customer.create({
            phone,
            name,
            role: "customer",
        });

        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        console.error("POS customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        let query = { isActive: true };

        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.phone = id;
        }

        const customer = await Customer.findOne(query);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        customer.isActive = false;
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (error) {
        console.error("Delete customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
