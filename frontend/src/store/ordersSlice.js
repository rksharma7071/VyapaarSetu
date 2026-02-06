import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${api}/order`);
            return res.data.data || res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch orders",
            );
        }
    },
);

export const fetchOrderById = createAsyncThunk(
    "orders/fetchOrderById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${api}/order/${id}`);
            return res.data.data || res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch order",
            );
        }
    },
);

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        selectedOrder: null,

        posOrder: null,

        loading: false,
        error: null,

        statusFilter: "",
        paymentFilter: "",
    },
    reducers: {
        setStatusFilter(state, action) {
            state.statusFilter = action.payload;
        },
        setPaymentFilter(state, action) {
            state.paymentFilter = action.payload;
        },
        clearOrderFilters(state) {
            state.statusFilter = "";
            state.paymentFilter = "";
        },
        clearOrders(state) {
            state.orders = [];
        },
        setPosOrder(state, action) {
            state.posOrder = action.payload;
        },
        clearPosOrder(state) {
            state.posOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setStatusFilter,
    setPaymentFilter,
    clearOrderFilters,
    clearOrders,

    setPosOrder,
    clearPosOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
