import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Home from "./views/Home"
import Footer from "./components/Footer"
import ErrorPage from "./views/Error"
import {Toaster} from 'react-hot-toast'
import Login from "./views/Login"
import Register from "./views/Register"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Cart from "./views/Cart"
import Wishlist from "./views/Wishlist"
import Products from "./views/Products"

export default function App() {
  return (
    <ThemeProvider>
        <Router>
            <Toaster />
            <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                 <Route path="/products" element={<Products />} />
                {/* <Route path="/products/:id" element={<ProductDetail />} /> */}

                {/* Protected Routes */}
                 <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                {/* <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                {/* <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                /> */}
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            <Footer />
        </Router>
    </ThemeProvider>
  )
}