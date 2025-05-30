import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export interface ReviewProps {
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
}

export interface Product{
  _id: string
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  inStock: boolean;
  isNewProduct: boolean;
  isFeatured: boolean;
  isSale: boolean;
  reviews: ReviewProps[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

interface CartItem {
  _id: string
  product: Product
  quantity: number
  price: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
}

// Async thunks
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:8000/api/cart/add-to-cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data.cart
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart")
    }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        // Update cart with response data
        if (action.payload.items) {
          state.items = action.payload.items
          state.totalItems = action.payload.items.reduce((total: number, item: any) => total + item.quantity, 0)
          state.totalAmount = action.payload.totalPrice || 0
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCart, clearCart, removeFromCart, clearCartError } = cartSlice.actions
export default cartSlice.reducer