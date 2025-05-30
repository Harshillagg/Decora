import { configureStore } from "@reduxjs/toolkit"
import cartSlice from "./slices/cartSlice"
import authSlice from "./slices/authSlice"
import productSlice from "./slices/productSlice"
import wishlistSlice from "./slices/wishlistSlice"

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    products: productSlice,
    wishlist: wishlistSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch