import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/POS/Header";
import { GoScreenFull } from "react-icons/go";
import { TiShoppingCart } from "react-icons/ti";
import { RiResetRightFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import Cart from "../components/POS/Cart";

function POS() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState([]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);



    const categories = useMemo(() => {
        const unique = new Set(products.map((p) => p.category));
        return ["All", ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p._id === product._id);
            if (existing) {
                return prev.map(p =>
                    p._id === product._id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const increaseQty = (id) => {
        setCart(prev =>
            prev.map(item =>
                item._id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart(prev =>
            prev
                .map(item =>
                    item._id === id ? { ...item, qty: item.qty - 1 } : item
                )
                .filter(item => item.qty > 0)
        );
    };

    const resetCart = () => setCart([]);

    if (loading) {
        return <div className="p-10 text-center">Loading products…</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: PRODUCTS */}
                <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">

                    {/* Categories */}
                    <div className="shrink-0 rounded-xl border border-gray-300 bg-white p-4">
                        <h2 className="mb-3 font-semibold">Categories</h2>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-full px-4 py-2 text-sm border
                                ${activeCategory === cat
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white border-gray-300 hover:border-primary"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {filteredProducts.map(product => (
                                <button
                                    key={product._id}
                                    onClick={() => addToCart(product)}
                                    className="rounded-xl border border-gray-300 bg-white p-3 transition hover:shadow-md"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="mb-2 aspect-square rounded-lg object-cover"
                                    />
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium truncate">
                                            {product.name}
                                        </span>
                                        <span className="text-primary font-semibold">
                                            ₹{product.price}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CART (Desktop) */}
                <div className="hidden md:flex w-full max-w-sm flex-col border-l border-gray-300 bg-white p-5">
                    <Cart
                        cart={cart}
                        subtotal={subtotal}
                        increaseQty={increaseQty}
                        decreaseQty={decreaseQty}
                    />
                </div>
            </div>

            {/* MOBILE CART BAR */}
            <div className="md:hidden border-t border-gray-300 bg-white p-3">
                <button
                    className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white font-semibold"
                >
                    <span>{cart.length} items</span>
                    <span>₹{subtotal}</span>
                    <span>View Cart</span>
                </button>
            </div>
        </div>
    );
}

export default POS;
