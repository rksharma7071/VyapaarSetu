import React, { useMemo, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { setPosOrder, clearPosOrder } from "../../store/ordersSlice";
import { useDispatch } from "react-redux";

function Checkout() {
    const navigate = useNavigate();

    const { cart = [] } = useOutletContext();

    const dispatch = useDispatch();

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
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

            const customerRes = await axios.post("/customers", customer);
            const customerId = customerRes.data.data._id;

            // 2️⃣ Create order
            await axios.post("/orders", {
                customerId,
                items: cart.map(item => ({
                    productId: item._id,
                    qty: item.qty,
                })),
                tax,
                discount,
                paymentMethod,
                notes,
            });

            alert("Order created successfully");

            // 🟢 Clear POS order after success
            dispatch(clearPosOrder());

            navigate("/pos");
        } catch (err) {
            alert(err.response?.data?.message || "Checkout failed");
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
                    <input
                        type="text"
                        placeholder="Customer Name"
                        className="rounded-lg border border-gray-300 p-3"
                        value={customer.name}
                        onChange={(e) =>
                            setCustomer({ ...customer, name: e.target.value })
                        }
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="rounded-lg border border-gray-300 p-3"
                        value={customer.phone}
                        onChange={(e) =>
                            setCustomer({ ...customer, phone: e.target.value })
                        }
                    />
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
                        <input
                            type="number"
                            className="w-24 rounded border border-gray-300 p-1 text-right"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <input
                            type="number"
                            className="w-24 rounded border border-gray-300 p-1 text-right"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
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
                    className="mb-3 w-full rounded-lg border border-gray-300 p-3"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                </select>

                <textarea
                    placeholder="Notes (optional)"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
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
