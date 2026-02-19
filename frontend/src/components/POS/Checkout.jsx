import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setPosOrder, clearPosOrder } from "../../store/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import { clearCart } from "../../store/cartSlice";
import { useAlert } from "../UI/AlertProvider";

function Checkout() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart.items);
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const stores = useSelector((state) => state.stores.items);
    const store = useMemo(
        () => stores.find((s) => s._id === storeId),
        [stores, storeId],
    );
    const dispatch = useDispatch();
    const { notify } = useAlert();

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
    });

    const [discount, setDiscount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const round2 = (value) =>
        Math.round((Number(value) + Number.EPSILON) * 100) / 100;

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [cart]);

    const taxRate = Number(store?.defaultTaxRate || 0);
    const taxAmount = useMemo(() => {
        return round2((subtotal * taxRate) / 100);
    }, [subtotal, taxRate]);

    const total = useMemo(() => {
        return subtotal + Number(taxAmount) - Number(discount);
    }, [subtotal, taxAmount, discount]);

    useEffect(() => {
        if (!discountApplied) return;
        setDiscount(0);
        setDiscountApplied(false);
        setDiscountCode("");
        notify({
            type: "info",
            title: "Discount reset",
            message: "Cart changed, please apply discount again.",
            autoClose: 3500,
        });
    }, [subtotal, taxAmount]);

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            notify({
                type: "warning",
                title: "Enter code",
                message: "Please enter a discount code.",
            });
            return;
        }
        try {
            setApplyingDiscount(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/discount/apply`,
                {
                    code: discountCode.trim(),
                    amount: subtotal + Number(taxAmount),
                },
            );
            const amount = Number(res.data?.discountAmount || 0);
            setDiscount(amount);
            setDiscountApplied(true);
            notify({
                type: "success",
                title: "Discount applied",
                message: `Discount applied: ₹${amount}`,
            });
        } catch (err) {
            notify({
                type: "error",
                title: "Invalid code",
                message: err.response?.data?.message || "Failed to apply discount.",
            });
        } finally {
            setApplyingDiscount(false);
        }
    };

    const handleClearDiscount = () => {
        setDiscount(0);
        setDiscountApplied(false);
        setDiscountCode("");
        notify({
            type: "info",
            title: "Discount removed",
            message: "Discount removed from this order.",
            autoClose: 2000,
        });
    };

    const handleCreateOrder = async () => {
        if (!cart.length) {
            notify({ type: "warning", title: "Cart is empty", message: "Add items before placing an order." });
            return;
        }
        if (!customer.name || !customer.phone) {
            notify({
                type: "warning",
                title: "Customer details required",
                message: "Customer name and phone are required.",
            });
            return;
        }
        if (!storeId) {
            notify({ type: "warning", title: "Store missing", message: "Select a store first." });
            return;
        }

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

            const idempotencyKey = crypto.randomUUID();
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
            }, {
                headers: { "Idempotency-Key": idempotencyKey },
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
                        notify({
                            type: "success",
                            title: "Payment successful",
                            message: "Order completed successfully.",
                        });
                        dispatch(clearCart());
                        dispatch(clearPosOrder());
                        navigate("/pos");
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return;
            }

            notify({
                type: "success",
                title: "Order created",
                message: "Order completed successfully.",
            });
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
                notify({
                    type: "info",
                    title: "Saved offline",
                    message: "Order saved offline. It will sync when online.",
                    autoClose: 5000,
                });
                dispatch(clearCart());
                dispatch(clearPosOrder());
                navigate("/pos");
            } else {
                notify({
                    type: "error",
                    title: "Checkout failed",
                    message: err.response?.data?.message || "Checkout failed",
                });
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex h-full flex-col gap-4">
            {/* Customer */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h2 className="mb-3 font-semibold">Customer</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input name="name" value={customer.name} placeholder="Customer Name" onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                    <Input type="tel" name="phone" value={customer.phone} placeholder="Phone Number" onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h2 className="mb-3 font-semibold">Order Summary</h2>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax ({taxRate}%)</span>
                        <span>₹{taxAmount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <Input value={discount} readOnly className={"!w-24"} />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <div className="text-xs text-gray-500">Discount Code</div>
                        <div className="flex gap-2">
                            <Input
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                placeholder="Enter code"
                            />
                            {!discountApplied ? (
                                <button
                                    type="button"
                                    onClick={handleApplyDiscount}
                                    disabled={applyingDiscount}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                                >
                                    {applyingDiscount ? "Applying..." : "Apply"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleClearDiscount}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h2 className="mb-3 font-semibold">Payment</h2>

                <select
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 mb-3 pr-10 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
                    className="flex-1 rounded-lg border border-gray-200 py-3"
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
