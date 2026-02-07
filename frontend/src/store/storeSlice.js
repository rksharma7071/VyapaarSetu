import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchStores = createAsyncThunk(
    "stores/fetchStores",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${api}/store`);
            return res.data.data || [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch stores",
            );
        }
    },
);

const storeSlice = createSlice({
    name: "stores",
    initialState: {
        items: [],
        selectedStoreId: localStorage.getItem("pos_store_id") || "",
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedStore(state, action) {
            state.selectedStoreId = action.payload;
            if (action.payload) {
                localStorage.setItem("pos_store_id", action.payload);
            } else {
                localStorage.removeItem("pos_store_id");
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                if (!state.selectedStoreId && action.payload.length > 0) {
                    state.selectedStoreId = action.payload[0]._id;
                    localStorage.setItem(
                        "pos_store_id",
                        action.payload[0]._id,
                    );
                }
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedStore } = storeSlice.actions;

export default storeSlice.reducer;
