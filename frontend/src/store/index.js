import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice.js";
import ordersReducer from "./ordersSlice.js";
import cartReducer from "./cartSlice.js";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        cart: cartReducer,
    },
});
