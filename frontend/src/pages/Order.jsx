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
import { fetchOrders, setPaymentFilter, setStatusFilter } from "../store/ordersSlice";
import Input from "../components/UI/Input";

function Order() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        orders,
        loading,
        error,
        statusFilter,
        paymentFilter,
    } = useSelector((state) => state.orders);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrders, setSelectedOrders] = useState([]);


    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.orderNumber.toString().includes(searchTerm);

            const matchesStatus =
                !statusFilter || order.status === statusFilter;

            const matchesPayment =
                !paymentFilter || order.paymentMethod === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, searchTerm, statusFilter, paymentFilter]);


    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handleSelectOrder = (id) => {
        setSelectedOrders((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleCancelOrder = (id) => {
        if (window.confirm("Cancel this order?")) {
            dispatch(cancelOrder(id));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(currentOrders.map((o) => o._id));
        } else {
            setSelectedOrders([]);
        }
    };



    const isAllSelected =
        currentOrders.length > 0 &&
        currentOrders.every((o) => selectedOrders.includes(o._id));


    if (loading) {
        return null;
    }

    if (error) {
        return (
            <div className='bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto'>
                <div className='flex justify-between items-center'>
                    <div className='text-xl font-semibold text-gray-900'>Orders</div>
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
                <div className='text-xl font-semibold text-gray-900'>Orders</div>
                {/* <div className='flex gap-3 items-center font-semibold text-gray-900'>
                    <button onClick={() => navigate("/create-products")} className="flex justify-between items-center gap-2 w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <FiPlusCircle className='text-lg' /> Add Product
                    </button>
                    <button className="flex justify-between items-center gap-2 w-40 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30">
                        <FiDownload className='text-lg' /> Import Product
                    </button>
                </div> */}
            </div>

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
                                value={statusFilter}
                                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full">
                            <select
                                value={paymentFilter}
                                onChange={(e) => dispatch(setPaymentFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Payments</option>
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="overflow-x-auto bg-white max-h-[55vh] custom-scrollbar">
                        <table className="w-full text-sm border-collapse">
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
                                            <div className="h-4 w-4 rounded border border-gray-200 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                            </div>
                                        </label>
                                    </th>
                                    <th className="px-2 py-2 text-left font-semibold">Order #</th>
                                    {/* <th className="px-3 py-2 text-left">Items</th> */}
                                    <th className="px-2 py-2 text-left font-semibold">Total</th>
                                    <th className="px-2 py-2 text-left font-semibold">Payment</th>
                                    <th className="px-2 py-2 text-left font-semibold">Status</th>
                                    <th className="px-2 py-2 text-left font-semibold">Date</th>
                                    <th className="px-2 py-2 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {currentOrders.map((order) => (
                                    <tr key={order._id} className="transition hover:bg-gray-50">
                                        <td className="px-4 py-1 text-center">
                                            <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order._id)}
                                                    onChange={() => handleSelectOrder(order._id)}
                                                    className="peer hidden"
                                                />
                                                <div className="h-4 w-4 rounded border border-gray-200 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                    <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                                </div>
                                            </label>
                                        </td>
                                        <td className="px-2 py-1 text-gray-700 font-semibold cursor-pointer" onClick={() => navigate(order._id)}>#{order.orderNumber}</td>
                                        <td className="px-3 py-2 font-semibold">₹{order.total}</td>
                                        <td className="px-3 py-2 capitalize">{order.paymentMethod}</td>
                                        <td className="px-3 py-2">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{order.status}</span>
                                        </td>

                                        <td className="px-3 py-2 text-gray-600">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>

                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* <button
                                                    title="View"
                                                    onClick={() => navigate(order._id)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <LuEye className="text-lg group-hover:scale-110 transition" />
                                                </button> */}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="font-medium">Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <span className="text-gray-500">
                                {/* {filteredProducts.length > 0
                                    ? `${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`
                                    : "0 of 0"} */}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {/* {getPageNumbers().map((page, index) =>
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
                                                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )} */}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order
