import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ReviewProps {
    userId: string
    userName: string
    rating: number
    comment: string
}

export interface Product{
  _id: string
    name: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: string;
  stock: number;
  isNewProduct: boolean;
  isFeatured: boolean;
  isSale: boolean;
  reviews: ReviewProps[];
  tags: string[];
  rating: number;
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
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
