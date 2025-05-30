"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react"
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "react-hot-toast"
import axios from "axios"
import { clearCart, removeFromCart, setCart } from "../store/slices/cartSlice"

const Cart: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { items, totalItems, totalAmount } = useAppSelector((state) => state.cart)
  const [isLoading, setIsLoading] = useState(false)

  const getCart = async () => {
    setIsLoading(true)

    try{
        const response = await axios.get("http://localhost:8000/api/cart/get-cart")
        dispatch(setCart(response.data.cart))
        toast.success("Cart fetched")
    } catch (error) {
        console.error("Failed to fetch cart:", error)
        toast.error("Failed to fetch cart")
    } finally{
        setIsLoading(false)
    }
  }

  useEffect(() => {
    getCart()
  }, [dispatch])

  const handleRemove = async (itemId: string) => {
    try {
      await axios.delete(`/api/cart/remove-from-cart/${itemId}`); // Replace with your API endpoint
      dispatch(removeFromCart(itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item from cart");
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await axios.delete('/api/cart/clear-cart'); // Replace with your API endpoint
      dispatch(clearCart());
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Update quantity - example
  const handleQuantityUpdate = async (itemId: string, quantity: number) => {
    try {
      await axios.put(`/api/cart/add-to-cart/${itemId}`, { quantity }); // Replace with your API
      getCart(); // Re-fetch to ensure the UI is up-to-date
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const subtotal = totalAmount
  const shipping = subtotal > 99 ? 0 : 15
  const tax = (subtotal) * 0.08
  const finalTotal = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg" className="group">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleClearCart} icon={<Trash2 className="w-4 h-4" />}>
              Clear Cart
            </Button>
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Link to={`/products/${item.product._id}`}>
                      <img
                        src={item.product.images[0] || "/placeholder.svg?height=150&width=150"}
                        alt={item.product.name}
                        className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                      />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.product.description}</p>
                      
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">${item.product.discountPrice}</span>
                        {item.product.price && item.product.price > item.product.discountPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${item.product.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                            disabled={
                              item.quantity >= item.product.stock 
                            }
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.product.stock && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Only {item.product.stock} items left in stock
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
             

              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  fullWidth
                  size="lg"
                  className="mt-6 group"
                  icon={<ShoppingBag className="w-5 h-5" />}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Shop With Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">On orders over $99</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Easy Returns</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">100% secure checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
