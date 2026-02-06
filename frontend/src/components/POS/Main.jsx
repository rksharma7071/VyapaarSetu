import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Cart from "./Cart";
import Loading from "../Loading";
import { fetchProducts } from "../../store/productsSlice";
import {
    addToCart,
    increaseQty,
    decreaseQty,
} from "../../store/cartSlice";

function Main() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.products);

    const cart = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

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
