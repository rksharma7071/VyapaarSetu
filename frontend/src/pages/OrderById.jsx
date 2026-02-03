import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../store/ordersSlice";
import { LuArrowLeft } from "react-icons/lu";
import Loading from "../components/Loading";

function OrderById() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedOrder, loading, error } = useSelector(
        (state) => state.orders
    );

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    if (loading) {
        <Loading />
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                ⚠️ {error}
            </div>
        );
    }

    if (!selectedOrder) return null;

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
                >
                    <LuArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    Order #{selectedOrder.orderNumber}
                </h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Payment</p>
                        <p className="font-medium capitalize">
                            {selectedOrder.paymentMethod}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium capitalize">
                            {selectedOrder.status}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold">₹{selectedOrder.total}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {selectedOrder.items.map((item) => (
                            <tr key={item.productId._id}>
                                <td className="px-4 py-2">
                                    {item.name}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {item.qty}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    ₹{item.unitPrice}
                                </td>
                                <td className="px-4 py-2 text-right font-medium">
                                    ₹{item.totalPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderById;
