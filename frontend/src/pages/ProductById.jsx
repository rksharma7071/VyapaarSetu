import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/productsSlice";
import { LuArrowLeft } from "react-icons/lu";
import Loading from "../components/Loading";

function ProductById() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedProduct, loading, error } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(fetchProductById(slug));
    }, [dispatch, slug]);

    if (loading) {
        <Loading />
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600">
                ⚠️ {error}
            </div>
        );
    }

    if (!selectedProduct) return null;

    const {
        name,
        image,
        description,
        price,
        taxRate,
        stockQty,
        unit,
        sku,
        category,
        type,
        isActive,
        createdAt,
        updatedAt,
    } = selectedProduct;

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
                >
                    <LuArrowLeft />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Product Details
                </h1>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image */}
                <div className="space-y-4">
                    <div className="border border-gray-300 rounded-xl overflow-hidden">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-72 object-contain"
                        />
                    </div>

                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {isActive ? "Active Product" : "Inactive Product"}
                    </span>
                </div>

                {/* Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {name}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Stat label="Price" value={`₹${price}`} />
                        <Stat label="Tax Rate" value={`${taxRate}%`} />
                        <Stat
                            label="Stock"
                            value={`${stockQty} ${unit}`}
                        />
                        <Stat label="SKU" value={sku} />
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <Meta label="Category" value={category} />
                        <Meta label="Type" value={type} />
                        <Meta
                            label="Created"
                            value={new Date(createdAt).toLocaleDateString()}
                        />
                        <Meta
                            label="Updated"
                            value={new Date(updatedAt).toLocaleDateString()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- Small Components ---------- */

function Stat({ label, value }) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <p className="text-xs text-gray-500 uppercase">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function Meta({ label, value }) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium text-gray-900">{value}</p>
        </div>
    );
}

export default ProductById;
