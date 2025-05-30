"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"
import { Star, Heart, ShoppingCart, Eye, Share2 } from "lucide-react"
import type { Product } from "../../store/slices/cartSlice"
import Button from "../ui/Button"
import { toast } from "react-hot-toast"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = "grid" }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isInWishlist = wishlistItems.some((item) => item._id === product._id)
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    setIsAddingToCart(true)
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap()
      toast.success("Added to cart!")
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist")
      return
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap()
        toast.success("Removed from wishlist")
      } else {
        await dispatch(addToWishlist(product._id)).unwrap()
        toast.success("Added to wishlist")
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.origin + `/products/${product._id}`,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.origin + `/products/${product._id}`)
      toast.success("Product link copied to clipboard!")
    }
  }

  if (viewMode === "list") {
    return (
      <Link
        to={`/products/${product._id}`}
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg?height=200&width=300"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onMouseEnter={() => {
                if (product.images.length > 1) {
                  setCurrentImageIndex(1)
                }
              }}
              onMouseLeave={() => setCurrentImageIndex(0)}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {!product.inStock && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Out of Stock</span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                  -{discountPercentage}%
                </span>
              )}
              {product.tags.includes("new") && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">New</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 ${
                  isInWishlist ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                  View
                </Button>
                <Button
                  onClick={handleAddToCart}
                  loading={isAddingToCart}
                  disabled={!product.inStock}
                  size="sm"
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.images[currentImageIndex] || "/placeholder.svg?height=250&width=300"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onMouseEnter={() => {
            if (product.images.length > 1) {
              setCurrentImageIndex(1)
            }
          }}
          onMouseLeave={() => setCurrentImageIndex(0)}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {!product.inStock && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Out of Stock</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
              -{discountPercentage}%
            </span>
          )}
          {product.tags.includes("new") && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">New</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 ${
              isInWishlist ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            loading={isAddingToCart}
            disabled={!product.inStock}
            fullWidth
            size="sm"
            icon={<ShoppingCart className="w-4 h-4" />}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
