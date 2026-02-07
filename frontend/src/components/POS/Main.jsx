import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Cart from "./Cart";
import Loading from "../Loading";
import { fetchProducts } from "../../store/productsSlice";
import { fetchStores } from "../../store/storeSlice";
import {
    addToCart,
    increaseQty,
    decreaseQty,
} from "../../store/cartSlice";
import axios from "axios";

function Main() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.products);
    const selectedStoreId = useSelector(
        (state) => state.stores.selectedStoreId,
    );

    const cart = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, selectedStoreId]);

    useEffect(() => {
        const syncOfflineOrders = async () => {
            const pending = JSON.parse(
                localStorage.getItem("pos_offline_orders") || "[]",
            );
            if (!pending.length || !navigator.onLine) return;

            const remaining = [];
            for (const order of pending) {
                try {
                    const customerRes = await axios.post(
                        `${import.meta.env.VITE_API_URL}/customer`,
                        order.customer,
                    );
                    const customerId = customerRes.data.data._id;
                    await axios.post(`${import.meta.env.VITE_API_URL}/order`, {
                        storeId: order.storeId,
                        customerId,
                        customer: order.customer,
                        items: order.items,
                        discount: order.discount,
                        paymentMethod: order.paymentMethod,
                        notes: order.notes,
                    });
                } catch (err) {
                    remaining.push(order);
                }
            }
            localStorage.setItem(
                "pos_offline_orders",
                JSON.stringify(remaining),
            );
        };

        const handleOnline = () => syncOfflineOrders();
        window.addEventListener("online", handleOnline);
        syncOfflineOrders();

        return () => window.removeEventListener("online", handleOnline);
    }, []);

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [cart]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">{error}</div>;
    }

    return (
        <>
            <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
                        <Outlet
                            context={{
                                addToCart,
                                cart,
                                addToCart: (product) => dispatch(addToCart(product))
                            }}
                        />
                    </div>

                    <div className="hidden md:flex w-full max-w-sm flex-col border-l border-gray-300 bg-white p-5">
                        <Cart
                            cart={cart}
                            subtotal={subtotal}
                            increaseQty={increaseQty}
                            decreaseQty={decreaseQty}
                        />
                    </div>
                </div>

                <div className="md:hidden border-t border-gray-300 bg-white p-3">
                    <button className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white font-semibold">
                        <span>{cart.length} items</span>
                        <span>₹{subtotal}</span>
                        <span>View Cart</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Main;
