import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const existing = state.items.find(
                (item) => item._id === product._id,
            );

            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...product, qty: 1 });
            }
        },

        increaseQty(state, action) {
            const id = action.payload;
            const item = state.items.find((i) => i._id === id);
            if (item) item.qty += 1;
        },

        decreaseQty(state, action) {
            const id = action.payload;
            const item = state.items.find((i) => i._id === id);
            if (item) {
                item.qty -= 1;
                if (item.qty <= 0) {
                    state.items = state.items.filter((i) => i._id !== id);
                }
            }
        },

        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, increaseQty, decreaseQty, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;
