import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
    addToCart,
    increaseQty,
    decreaseQty,
} from "../store/cartSlice.js";
import Input from "../components/UI/Input";
function POS() {
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);
    // const { addToCart, setCart } = useOutletContext();

    const [activeCategory, setActiveCategory] = useState("All");
    const [scanValue, setScanValue] = useState("");

    const categories = useMemo(() => {
        const unique = new Set(products.map((p) => p.category));
        return ["All", ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    const handleScan = (e) => {
        if (e.key !== "Enter") return;
        const value = scanValue.trim().toLowerCase();
        if (!value) return;
        const match = products.find(
            (p) =>
                p.sku?.toLowerCase() === value ||
                p.slug?.toLowerCase() === value ||
                p.name?.toLowerCase().includes(value),
        );
        if (match) {
            dispatch(addToCart(match));
        } else {
            alert("Product not found");
        }
        setScanValue("");
    };

    return (
        <>
            <div className="shrink-0 rounded-xl border border-gray-300 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold">Scanner / Keyboard</h2>
                    <Input
                        value={scanValue}
                        onChange={(e) => setScanValue(e.target.value)}
                        onKeyDown={handleScan}
                        placeholder="Scan barcode / type SKU and press Enter"
                        className="w-full sm:w-96"
                    />
                </div>
            </div>

            <div className="shrink-0 rounded-xl border border-gray-300 bg-white p-4">
                <h2 className="mb-3 font-semibold">Categories</h2>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
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

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredProducts.map((product) => (
                        <button
                            key={product._id}
                            onClick={() => dispatch(addToCart(product))}
                            className="rounded-xl border border-gray-300 bg-white p-3 transition hover:shadow-md"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="mb-2 aspect-square rounded-lg object-cover"
                                loading="lazy"
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
        </>
    );
}

export default POS;
