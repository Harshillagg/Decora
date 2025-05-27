import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Home from "./views/Home"
import Footer from "./components/Footer"
import ErrorPage from "./views/Error"

export default function App() {
//   useEffect(() => {
//     dispatch(checkAuthStatus())
//   }, [dispatch])

  return (
    <ThemeProvider>
        <Router>
            <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                {/* <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> */}

                {/* Protected Routes */}
                {/* <Route
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
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
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
              </Routes> */
            <Footer />
        </Router>
    </ThemeProvider>
  )
}