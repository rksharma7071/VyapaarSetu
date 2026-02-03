import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${api}/product`);
            return res.data.data.products;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch products",
            );
        }
    },
);

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${api}/product/${id}`);
            return res.data.data || res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch product",
            );
        }
    },
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (slug, { rejectWithValue }) => {
        try {
            await axios.delete(`${api}/product/${slug}`);
            return slug;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Delete failed",
            );
        }
    },
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        loading: false,
        error: null,
        categoryFilter: "",
        typeFilter: "",
    },
    reducers: {
        setCategoryFilter(state, action) {
            state.categoryFilter = action.payload;
        },
        setTypeFilter(state, action) {
            state.typeFilter = action.payload;
        },
        clearFilters(state) {
            state.categoryFilter = "";
            state.typeFilter = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (p) => p.slug !== action.payload,
                );
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setCategoryFilter, setTypeFilter, clearFilters } =
    productsSlice.actions;

export default productsSlice.reducer;
