import React from 'react'
import { useNavigate } from "react-router-dom";
import {
    addToCart,
    increaseQty,
    decreaseQty,
} from "../../store/cartSlice";
import { useDispatch, useSelector } from 'react-redux';


function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );
    return (
        <>
            <h2 className="mb-4 text-lg font-semibold">Cart</h2>

            {cart.length === 0 && (
                <p className="text-sm text-gray-500">Cart is empty</p>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {cart.map(item => (
                    <div
                        key={item._id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={item.image}
                                className="h-12 w-12 rounded-lg object-cover"
                                alt={item.name}
                            />
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                            </div>
                        </div>

                        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => dispatch(decreaseQty(item._id))}
                                className="h-8 w-8 text-lg hover:bg-gray-100"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                                {item.qty}
                            </span>
                            <button
                                onClick={() => dispatch(increaseQty(item._id))}
                                className="h-8 w-8 text-lg hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{subtotal}</span>
                </div>

                <button onClick={() => navigate("/pos/checkout")} className="mt-4 w-full rounded-lg bg-primary py-3 text-white font-semibold">
                    Checkout
                </button>
            </div>
        </>
    )
}

export default Cart