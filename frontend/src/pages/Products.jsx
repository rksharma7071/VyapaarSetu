import React, { useEffect, useMemo, useState } from "react";
import { FiDownload, FiPlusCircle } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchProducts,
    deleteProduct,
    setCategoryFilter,
    setTypeFilter,
} from "../store/productsSlice";
import Loading from "../components/Loading";
import Input from "../components/UI/Input";

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        products,
        loading,
        error,
        categoryFilter,
        typeFilter,
    } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedProducts, setSelectedProducts] = useState([]);

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    /* ---------------- FILTER OPTIONS ---------------- */
    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category))],
        [products]
    );

    const types = useMemo(
        () => [...new Set(products.map((p) => p.type))],
        [products]
    );

    /* ---------------- FILTER + SEARCH ---------------- */
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                !categoryFilter || product.category === categoryFilter;

            const matchesType =
                !typeFilter || product.type === typeFilter;

            return matchesSearch && matchesCategory && matchesType;
        });
    }, [products, searchTerm, categoryFilter, typeFilter]);

    /* ---------------- SORT (NEWEST FIRST) ---------------- */
    const sortedProducts = useMemo(
        () => [...filteredProducts].reverse(),
        [filteredProducts]
    );

    /* ---------------- PAGINATION ---------------- */
    const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    /* ---------------- HANDLERS ---------------- */
    const handleDelete = (slug) => {
        if (window.confirm("Delete this product?")) {
            dispatch(deleteProduct(slug));
        }
    };

    const handleSelectAll = (e) => {
        setSelectedProducts(
            e.target.checked ? currentProducts.map((p) => p._id) : []
        );
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRefresh = () => {
        dispatch(fetchProducts());
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
        } else {
            pages.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages
            );
        }

        return pages;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, typeFilter]);

    const isAllSelected = currentProducts.length > 0 && currentProducts.every((p) => selectedProducts.includes(p._id));

    if (loading) {
        <Loading />
    }

    if (error) {
        return (
            <div className='bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto'>
                <div className='flex justify-between items-center'>
                    <div className='text-xl font-semibold text-gray-900'>Products</div>
                </div>
                <div className='rounded-lg border border-red-200 bg-red-50 p-12'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='text-red-600 text-lg'>⚠️ {error}</div>
                        <button
                            onClick={handleRefresh}
                            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className='flex justify-between items-center'>
                <div className='text-xl font-semibold text-gray-900'>Products</div>
                <div className='flex gap-3 items-center font-semibold text-gray-900'>
                    <button onClick={() => navigate("/create-products")} className="flex justify-between items-center gap-2 w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <FiPlusCircle className='text-lg' /> Add
                    </button>
                    <button className="flex justify-between items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30">
                        <FiDownload className='text-lg' /> Import
                    </button>
                </div>
            </div>

            {/* SEARCH + FILTERS */}

            <div className='rounded-lg border border-gray-200 bg-white text-gray-600'>
                <div className='flex flex-col md:flex-row justify-between gap-4 p-5'>
                    <div className="relative flex items-center w-full max-w-sm">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <span className="absolute left-3 text-gray-500">
                            <IoSearch className="text-lg" />
                        </span>
                        <Input
                            placeholder="Search…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-5"
                        />
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="relative w-full">
                            <select
                                value={categoryFilter}
                                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full">
                            <select
                                value={typeFilter}
                                onChange={(e) => dispatch(setTypeFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Types</option>
                                {types.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="overflow-x-auto bg-white max-h-[55vh] custom-scrollbar">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-gray-200 text-gray-900">
                                <tr>
                                    <th className="px-2 py-2 text-center">
                                        <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="peer hidden"
                                            />
                                            <div className="h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                            </div>
                                        </label>
                                    </th>
                                    {/* <th className="px-2 py-2 text-left font-semibold">SKU</th> */}
                                    <th className="px-2 py-2 text-left font-semibold">Product</th>
                                    <th className="px-2 py-2 text-left font-semibold">Category</th>
                                    <th className="px-2 py-2 text-left font-semibold">Type</th>
                                    <th className="px-2 py-2 text-left font-semibold">Price</th>
                                    <th className="px-2 py-2 text-left font-semibold">Unit</th>
                                    <th className="px-2 py-2 text-left font-semibold">Qty</th>
                                    <th className="px-2 py-2 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                {currentProducts.length > 0 ? (currentProducts.map((product) => (
                                    <tr key={product._id} className="transition hover:bg-gray-50">
                                        <td className="px-4 py-1 text-center">
                                            <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => handleSelectProduct(product._id)}
                                                    className="peer hidden"
                                                />
                                                <div className="h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                    <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                                </div>
                                            </label>
                                        </td>
                                        {/* <td className="px-2 py-1 text-gray-700">{product.sku}</td> */}
                                        <td className="px-2 py-1">
                                            <div className="flex items-center gap-3 hover:cursor-pointer" onClick={() => navigate(`/products/${product.slug}`)}>
                                                <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 ">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="font-medium text-gray-800">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 text-gray-600">{product.category}</td>
                                        <td className="px-2 py-1 text-gray-600">{product.type}</td>
                                        <td className="px-2 py-1 font-medium text-gray-800">₹{product.price}</td>
                                        <td className="px-2 py-1 text-gray-600">{product.unit}</td>
                                        <td className="px-2 py-1">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{product.stockQty}</span>
                                        </td>
                                        <td className="px-2 py-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    title="View"
                                                    onClick={() => navigate(`/products/${product.slug}`)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <LuEye className="text-lg group-hover:scale-110 transition" />
                                                </button>
                                                <button
                                                    title="Edit"
                                                    onClick={() => navigate(`/products/${product.slug}`)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    <CiEdit className="text-lg group-hover:scale-110 transition" />
                                                </button>

                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(product.slug)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <RiDeleteBin5Line className="text-lg group-hover:scale-110 transition" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-2 py-10 text-center text-gray-500"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 bg-white border-t border-gray-300">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="font-medium">Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <span className="text-gray-500">
                                {filteredProducts.length > 0
                                    ? `${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`
                                    : "0 of 0"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="w-9 h-9 flex items-center justify-center text-gray-500"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-9 h-9 rounded-lg font-medium transition-colors ${currentPage === page
                                                ? "bg-primary text-white hover:bg-primary"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
