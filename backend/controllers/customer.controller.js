import mongoose from "mongoose";
import Customer from "../models/customer.model.js";

export const getCustomer = async (req, res) => {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        const customers = await Customer.find({ storeId })
            .select("_id name phone email gstin city state createdAt")
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
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }

        let query = { isActive: true, storeId };

        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.phone = id;
        }

        const customer = await Customer.findOne(query).select(
            "_id name phone email gstin address city state pincode createdAt",
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
        const { name, phone, email, gstin, address, city, state, pincode } =
            req.body;
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and phone number are required",
            });
        }

        let customer = await Customer.findOne({ phone, storeId });

        if (customer) {
            customer.name = name;
            customer.email = email ?? customer.email;
            customer.gstin = gstin ?? customer.gstin;
            customer.address = address ?? customer.address;
            customer.city = city ?? customer.city;
            customer.state = state ?? customer.state;
            customer.pincode = pincode ?? customer.pincode;
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
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            storeId,
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
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }

        let query = { isActive: true, storeId };

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
