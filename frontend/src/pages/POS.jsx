import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

function POS() {
    const { products } = useSelector((state) => state.products);
    const { addToCart } = useOutletContext();

    const [activeCategory, setActiveCategory] = useState("All");

    const categories = useMemo(() => {
        const unique = new Set(products.map((p) => p.category));
        return ["All", ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    return (
        <>
            <div className="shrink-0 rounded-xl border border-gray-300 bg-white p-4">
                <h2 className="mb-3 font-semibold">Categories</h2>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-4 py-2 text-sm border
                                ${
                                    activeCategory === cat
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
                            onClick={() => addToCart(product)}
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
