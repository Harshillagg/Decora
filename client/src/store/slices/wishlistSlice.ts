import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { Product } from "./cartSlice"

interface WishlistState {
  items: Product[]
  isLoading: boolean
  error: string | null
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8000/api/wishlist/get-wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.wishlist?.products || []
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist")
    }
  }
)

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:8000/api/wishlist/add-to-wishlist",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data.wishlist.products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist")
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(
        `http://localhost:8000/api/wishlist/remove-from-wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data.wishlist.products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist")
    }
  }
)

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearWishlistError } = wishlistSlice.actions
export default wishlistSlice.reducer