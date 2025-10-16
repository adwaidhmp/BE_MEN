import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import orderReducer from "./slice/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});
