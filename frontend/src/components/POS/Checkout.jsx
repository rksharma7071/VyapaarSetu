import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setPosOrder, clearPosOrder } from "../../store/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import { clearCart } from "../../store/cartSlice";

function Checkout() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart.items);
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const dispatch = useDispatch();

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        gstin: "",
        state: "",
        address: "",
    });

    const [tax, setTax] = useState(5);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [cart]);

    const total = useMemo(() => {
        return subtotal + Number(tax) - Number(discount);
    }, [subtotal, tax, discount]);

    const handleCreateOrder = async () => {
        if (!cart.length) return alert("Cart is empty");
        if (!customer.name || !customer.phone)
            return alert("Customer name and phone required");
        if (!storeId) return alert("Select a store first");

        const orderPayload = {
            customer,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                qty: item.qty,
                unitPrice: item.price,
                totalPrice: item.price * item.qty,
            })),
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
            notes,
        };

        try {
            setLoading(true);

            dispatch(setPosOrder(orderPayload));

            const customerRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/customer`,
                customer,
            );
            const customerId = customerRes.data.data._id;

            const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/order`, {
                storeId,
                customerId,
                customer,
                items: cart.map(item => ({
                    productId: item._id,
                    qty: item.qty,
                })),
                discount,
                paymentMethod,
                notes,
            });

            const createdOrder = orderRes.data.data;

            if (paymentMethod === "razorpay") {
                const scriptLoaded = await new Promise((resolve) => {
                    if (window.Razorpay) return resolve(true);
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });

                if (!scriptLoaded) throw new Error("Razorpay SDK failed");

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/razorpay/create-order`,
                    { orderId: createdOrder._id },
                );

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.razorpayOrder.amount,
                    currency: "INR",
                    name: "VyapaarSetu POS",
                    order_id: data.razorpayOrder.id,
                    handler: async (response) => {
                        await axios.post(
                            `${import.meta.env.VITE_API_URL}/razorpay/verify-payment`,
                            {
                                ...response,
                                orderId: createdOrder._id,
                            },
                        );
                        alert("Payment successful");
                        dispatch(clearCart());
                        dispatch(clearPosOrder());
                        navigate("/pos");
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return;
            }

            alert("Order created successfully");
            dispatch(clearCart());
            dispatch(clearPosOrder());
            navigate("/pos");
        } catch (err) {
            if (!navigator.onLine) {
                const pending = JSON.parse(
                    localStorage.getItem("pos_offline_orders") || "[]",
                );
                pending.push({
                    storeId,
                    customer,
                    items: cart.map(item => ({
                        productId: item._id,
                        qty: item.qty,
                    })),
                    discount,
                    paymentMethod,
                    notes,
                    createdAt: new Date().toISOString(),
                });
                localStorage.setItem(
                    "pos_offline_orders",
                    JSON.stringify(pending),
                );
                alert("Order saved offline. It will sync when online.");
                dispatch(clearCart());
                dispatch(clearPosOrder());
                navigate("/pos");
            } else {
                alert(err.response?.data?.message || "Checkout failed");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex h-full flex-col gap-4">
            {/* Customer */}
            <div className="rounded-xl border border-gray-300 bg-white p-4">
                <h2 className="mb-3 font-semibold">Customer</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input name="name" value={customer.name} placeholder="Customer Name" onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                    <Input type="tel" name="phone" value={customer.phone} placeholder="Phone Number" onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                    <Input name="gstin" value={customer.gstin} placeholder="GSTIN (optional)" onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })} />
                    <Input name="state" value={customer.state} placeholder="State (for GST)" onChange={(e) => setCustomer({ ...customer, state: e.target.value })} />
                </div>
                <div className="mt-3">
                    <Textarea placeholder="Address (optional)" onChange={(e) => setCustomer({ ...customer, address: e.target.value })} value={customer.address} />
                </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-gray-300 bg-white p-4">
                <h2 className="mb-3 font-semibold">Order Summary</h2>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <Input value={tax} onChange={(e) => setTax(e.target.value)} className={"!w-24"} />
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        {/* <input
                            type="number"
                            className="w-24 rounded border border-gray-300 p-1 text-right"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        /> */}
                        <Input value={discount} onChange={(e) => setDiscount(e.target.value)} className={"!w-24"} />
                    </div>

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-gray-300 bg-white p-4">
                <h2 className="mb-3 font-semibold">Payment</h2>

                <select
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-4 mb-3 pr-10 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="razorpay">Razorpay</option>
                </select>
                <Textarea placeholder="Notes (optional)" onChange={(e) => setNotes(e.target.value)} value={notes} />
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-3">
                <button
                    onClick={() => navigate("/pos")}
                    className="flex-1 rounded-lg border border-gray-300 py-3"
                >
                    Cancel
                </button>

                <button
                    disabled={loading}
                    onClick={handleCreateOrder}
                    className="flex-1 rounded-lg bg-primary py-3 text-white font-semibold"
                >
                    {loading ? "Processing..." : "Place Order"}
                </button>
            </div>
        </div>
    );
}

export default Checkout;
