import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { IoSearch } from 'react-icons/io5';
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { GoChevronDown } from 'react-icons/go';
import Input from "../components/UI/Input";
import Textarea from "../components/UI/Textarea";
import { useSelector } from "react-redux";
import axios from "axios";

function CreateProducts() {
    const navigate = useNavigate();
    const storeId = useSelector((state) => state.stores.selectedStoreId);

    const [slugEdited, setSlugEdited] = useState(false);
    const [product, setProduct] = useState({
        name: "",
        slug: "",
        description: "",
        category: "",
        price: "",
        sku: "",
        taxRate: "",
        gstRate: "",
        hsn: "",
        stockQty: "",
        unit: "",
        isActive: true,
    });
    const [categories, setCategories] = useState([]);

    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!storeId) return;
        axios
            .get(`${import.meta.env.VITE_API_URL}/category`)
            .then((res) => setCategories(res.data?.data || []))
            .catch(() => setCategories([]));
    }, [storeId]);

    const toSlug = (value) =>
        String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => {
            const next = { ...prev, [name]: value };
            if (name === "name" && !slugEdited) {
                next.slug = toSlug(value);
            }
            return next;
        });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleForm = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (storeId) {
            formData.append("storeId", storeId);
        }

        if (image) {
            formData.append("image", image);
        }


        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/product`, formData);
            localStorage.removeItem('products_cache');
            localStorage.removeItem('products_cache_time');
            navigate("/products");
        } catch (err) {
            console.error("Create product failed:", err.response?.data || err);
        }
    };

    return (
        <div className=' bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto'>
            <div className='flex justify-between items-center'>
                <div className='text-xl font-semibold text-gray-900'>Create Product</div>
                <div className='flex gap-3 items-center font-semibold text-gray-900'>
                    <button
                        onClick={() => navigate("/products")}
                        className="flex justify-between items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30"
                        type='submit'
                    >
                        <FaArrowLeft className='text-lg' />
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 overflow-y-auto">
                <form onSubmit={handleForm} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                        <Input name="name" value={product.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Slug <span className="text-red-500">*</span></label>
                        <Input
                            name="slug"
                            value={product.slug}
                            onChange={(e) => {
                                setSlugEdited(true);
                                handleChange(e);
                            }}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                        <Textarea rows={4} name="description" onChange={handleChange} value={product.description} />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                        <Input
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            placeholder="Type category name"
                            list="category-options"
                        />
                        <datalist id="category-options">
                            {categories.map((c) => (
                                <option key={c._id} value={c.name} />
                            ))}
                        </datalist>

                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                        <Input type="number" name="price" value={product.price} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">SKU <span className="text-red-500">*</span></label>
                        <Input name="sku" value={product.sku} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Tax Rate (%) <span className="text-red-500">*</span></label>
                        {/* <input
                            type="number"
                            name="taxRate"
                            value={product.taxRate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        /> */}
                        <Input name="taxRate" value={product.taxRate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">GST Rate (%)</label>
                        <Input name="gstRate" value={product.gstRate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">HSN Code</label>
                        <Input name="hsn" value={product.hsn} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                        <Input name="stockQty" value={product.stockQty} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Unit <span className="text-red-500">*</span></label>
                        <Input name="unit" value={product.unit} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Image <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm file:mr-4 file:rounded-l-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                name="status"
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">Select status</option>
                                <option value="true">Publish</option>
                                <option value="false">Draft</option>
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 focus:ring-2 focus:ring-primary/30"
                        >Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProducts
