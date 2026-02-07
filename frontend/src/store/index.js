import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice.js";
import ordersReducer from "./ordersSlice.js";
import cartReducer from "./cartSlice.js";
import storeReducer from "./storeSlice.js";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        cart: cartReducer,
        stores: storeReducer,
    },
});
