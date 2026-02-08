import express from "express";
import "dotenv/config";
import { connectDB } from "./config/database.js";
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import reviewRouter from "./routes/review.route.js";
import cartRouter from "./routes/cart.route.js";
import paymentRouter from "./routes/payment.route.js";
import discountRouter from "./routes/discount.route.js";
import orderRouter from "./routes/order.route.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import addressRoutes from "./routes/address.route.js";
import customerRoutes from "./routes/customer.route.js";
import storeRoutes from "./routes/store.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";
import supplierRoutes from "./routes/supplier.route.js";
import inventoryRoutes from "./routes/inventory.route.js";
import purchaseOrderRoutes from "./routes/purchaseOrder.route.js";
import invoiceRoutes from "./routes/invoice.route.js";
import returnRoutes from "./routes/return.route.js";
import reportRoutes from "./routes/report.route.js";
import rolePermissionRoutes from "./routes/rolePermission.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/review", reviewRouter);
app.use("/customer", customerRoutes);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use("/discount", discountRouter);
app.use("/order", orderRouter);
app.use("/razorpay", razorpayRoutes);
app.use("/address", addressRoutes);
app.use("/store", storeRoutes);
app.use("/category", categoryRoutes);
app.use("/brand", brandRoutes);
app.use("/supplier", supplierRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/purchase-order", purchaseOrderRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/return", returnRoutes);
app.use("/report", reportRoutes);
app.use("/role-permission", rolePermissionRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        "/product": "All Product",
        "/product/category": "All Category",
        "/user": "All User",
        "/user/id": "Specific User",
        "/auth": "Auth",
        "/review": "Review",
        "/cart": "Cart",
        "/discount": "Discount",
        "/payment": "Payment",
        "/order": "Order",
        "/address": "Address",
        "/razorpay": "razorpay",
        "/store": "Store",
        "/category": "Category",
        "/brand": "Brand",
        "/supplier": "Supplier",
        "/inventory": "Inventory",
        "/purchase-order": "Purchase Order",
        "/invoice": "Invoice",
        "/return": "Return",
        "/report": "Report",
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running https://localhost:${PORT}`);
});
