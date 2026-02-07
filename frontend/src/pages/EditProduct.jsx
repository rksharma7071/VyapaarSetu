import { useLoaderData, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { FiDownload } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { IoSearch } from 'react-icons/io5';
import { FaChevronDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { GoChevronDown } from 'react-icons/go';
import axios from 'axios';
import Input from '../components/UI/Input.jsx';
import Textarea from '../components/UI/Textarea.jsx';
import { useEffect } from "react";

function EditProduct() {
    const loader = useLoaderData();

    const [product, setProduct] = useState(loader || {});
    const [preview, setPreview] = useState(product?.image || "");
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [slugEdited, setSlugEdited] = useState(false);

    const navigate = useNavigate();

    const toSlug = (value) =>
        String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "name" && !slugEdited) {
                next.slug = toSlug(value);
            }
            return next;
        });
    }

    const handleRememberMe = (e) => {
        setRemember(e.target.checked);
    }

    const handleChangeFile = (e) => {
        const selectFile = e.target.files[0];
        if (selectFile) {
            setFile(selectFile)
            setPreview(URL.createObjectURL(selectFile))
        }
    }

    const handleForm = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("sku", product.sku);
        formData.append("description", product.description);
        formData.append("category", product.category);
        formData.append("price", product.price);
        formData.append("taxRate", product.taxRate);
        formData.append("stockQty", product.stockQty);
        formData.append("unit", product.unit);
        formData.append("isActive", product.isActive);


        if (product.slug !== loader.slug) { formData.append("newSlug", product.slug); }
        if (file) { formData.append("image", file); }

        await axios.patch(`${import.meta.env.VITE_API_URL}/product/${loader.slug}`, formData);
        localStorage.removeItem('products_cache');
        localStorage.removeItem('products_cache_time');
        navigate("/products");
        console.log("Product Added Successfully.");

    }

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/category`)
            .then((res) => setCategories(res.data?.data || []))
            .catch(() => setCategories([]));
    }, []);

    return (
        <div className=' bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto'>
            <div className='flex justify-between items-center'>
                <div className='text-xl font-semibold text-gray-900'>Edit Product</div>
                <div className='flex gap-3 items-center font-semibold text-gray-900'>
                    <button
                        className="flex justify-between items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30"
                        type='submit'
                        onClick={() => navigate('/products')}
                    >
                        <FaArrowLeft className='text-lg' /></button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8">
                <form onSubmit={handleForm} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor='name' className="mb-2 block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                        <Input name="name" value={product.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor='slug' className="mb-2 block text-sm font-medium text-gray-700">Slug <span className="text-red-500">*</span></label>
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
                        <label htmlFor='description' className="mb-2 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                        <Textarea rows={4} id='description' name="description" onChange={handleChange} value={product.description} />

                    </div>

                    <div>
                        <label htmlFor='category' className="mb-2 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                        <Input
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            list="category-options"
                        />
                        <datalist id="category-options">
                            {categories.map((c) => (
                                <option key={c._id} value={c.name} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor='price' className="mb-2 block text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                        <Input type="number" name="price" value={product.price} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor='sku' className="mb-2 block text-sm font-medium text-gray-700">SKU <span className="text-red-500">*</span></label>
                        <Input type="text" name="sku" value={product.sku} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor='taxRate' className="mb-2 block text-sm font-medium text-gray-700">Tax Rate (%) <span className="text-red-500">*</span></label>
                        <Input type="number" name="taxRate" value={product.taxRate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                        <Input type="number" name="stockQty" value={product.stockQty} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Unit <span className="text-red-500">*</span></label>
                        <Input name="unit" value={product.unit} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Product Image <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChangeFile}
                            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm file:mr-4 file:rounded-l-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                        />

                        {preview && (
                            <div className="mt-4">
                                <p className="mb-1 text-sm text-gray-600">Current Image</p>
                                <img
                                    src={preview}
                                    alt={product.name}
                                    className="h-32 w-32 rounded-lg border border-gray-300 object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                name="isActive"
                                value={String(product.isActive)}
                                onChange={(e) => setProduct(prev => ({ ...prev, isActive: e.target.value === "true" }))}
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

export default EditProduct
