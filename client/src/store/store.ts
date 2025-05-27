import { configureStore } from "@reduxjs/toolkit"
import cartSlice from "./slices/cartSlice"
import authSlice from "./slices/authSlice"
import productSlice from "./slices/productSlice"

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    products: productSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch