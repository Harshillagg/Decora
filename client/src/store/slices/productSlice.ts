import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "./cartSlice"

interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  color?: string
  material?: string
  room?: string
  inStock?: boolean
  rating?: number
  sortBy?: "price" | "rating" | "newest" | "popular"
  sortOrder?: "asc" | "desc"
}

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  filters: ProductFilters
  searchQuery: string
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    limit: number
  }
  categories: string[]
  colors: string[]
  materials: string[]
  rooms: string[]
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  filters: {},
  searchQuery: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  },
  categories: [],
  colors: [],
  materials: [],
  rooms: [],
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
  }
})

export const { setFilters, clearFilters, setSearchQuery, setCurrentPage } = productSlice.actions
export default productSlice.reducer
