"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { fetchWishlist, removeFromWishlist } from "../store/slices/wishlistSlice"
import { addToCart } from "../store/slices/cartSlice"
import { Heart, ShoppingCart, Trash2, Star, Share2, Filter, Grid, List, ArrowRight, Package } from 'lucide-react'
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "react-hot-toast"

const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch()

  const { items, isLoading } = useAppSelector((state) => state.wishlist)
  const { items: cartItems } = useAppSelector((state) => state.cart)

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap()
      toast.success("Removed from wishlist")
    } catch (error) {
      toast.error("Failed to remove from wishlist")
    }
  }

  const handleAddToCart = async (productId: string) => {
    setAddingToCart((prev) => new Set(prev).add(productId))

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap()
      toast.success("Added to cart!")
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddAllToCart = async () => {
    const availableItems = items.filter((item) => item.stock > 0)

    for (const item of availableItems) {
      try {
        await dispatch(addToCart({ productId: item._id, quantity: 1 })).unwrap()
      } catch (error) {
        console.error(`Failed to add ${item.name} to cart`)
      }
    }

    toast.success(`Added ${availableItems.length} items to cart!`)
  }

  const handleShare = async (product: any) => {
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
      navigator.clipboard.writeText(window.location.origin + `/products/${product._id}`)
      toast.success("Product link copied to clipboard!")
    }
  }

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product._id === productId)
  }

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter((item) => {
      if (filterCategory === "all") return true
      return item.category === filterCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

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
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
            <Link to="/products">
              <Button size="lg" className="group">
                Discover Products
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {items.some((item) => item.stock > 0) && (
              <Button onClick={handleAddAllToCart} icon={<ShoppingCart className="w-4 h-4" />}>
                Add All to Cart
              </Button>
            )}
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedItems.length} of {items.length} items
            </span>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Wishlist Items */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredAndSortedItems.map((product) => {
            const discountPercentage = product.price && product.discountPrice
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0

            if (viewMode === "list") {
              return (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
                      <Link to={`/products/${product._id}`}>
                        <img
                          src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {product.stock === 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            Out of Stock
                          </span>
                        )}
                        {discountPercentage > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            -{discountPercentage}%
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{product.description}</p>
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
                          {product.rating} ({product.reviews.length} reviews)
                        </span>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${product.discountPrice || product.price}
                          </span>
                          {product.discountPrice && product.price > product.discountPrice && (
                            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShare(product)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          {isInCart(product._id) ? (
                            <Button variant="outline" disabled size="sm">
                              In Cart
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(product._id)}
                              loading={addingToCart.has(product._id)}
                              disabled={product.stock === 0}
                              size="sm"
                              icon={<ShoppingCart className="w-4 h-4" />}
                            >
                              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={product._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images[0] || "/placeholder.svg?height=250&width=300"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.stock === 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(product)}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isInCart(product._id) ? (
                      <Button variant="outline" fullWidth size="sm" disabled>
                        In Cart
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(product._id)}
                        loading={addingToCart.has(product._id)}
                        disabled={product.stock === 0}
                        fullWidth
                        size="sm"
                        icon={<ShoppingCart className="w-4 h-4" />}
                      >
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Link
                    to={`/products/${product._id}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
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
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({product.reviews.length})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && product.price > product.discountPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State for Filtered Results */}
        {filteredAndSortedItems.length === 0 && items.length > 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters to see more items.</p>
            <Button onClick={() => setFilterCategory("all")}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist