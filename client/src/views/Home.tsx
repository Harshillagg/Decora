"use client"

import type React from "react"
// import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, ChevronRight } from "lucide-react"
import Button from "../components/ui/Button"
import SkeletonLoader from "../components/ui/SkeletonLoader"
import { useState } from "react"
import { useAppSelector } from "../hooks/redux"
import HeroCarousel from "../components/HeroCarousel"

const Home: React.FC = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const featuredProducts = useAppSelector((state) => state.products.featuredProducts)

  // useEffect(() => {
  //   setIsLoading(true);

  //   try {
         
  //   } catch (error) {
        
  //   }
  // }, [])


  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on orders over $99",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy returns within 30 days",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout process",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Premium quality products",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ]

  const categories = [
    {
      name: "Living Room",
      image: "/living-room.jpg",
      description: "Comfortable and stylish furniture",
      href: "/products?category=living-room",
    },
    {
      name: "Bedroom",
      image: "/bedroom.jpg",
      description: "Create your perfect sanctuary",
      href: "/products?category=bedroom",
    },
    {
      name: "Kitchen",
      image: "/kitchen.jpg",
      description: "Modern kitchen essentials",
      href: "/products?category=kitchen",
    },
    {
      name: "Office",
      image: "/office.jpg",
      description: "Productive workspace solutions",
      href: "/products?category=office",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section
        className={`relative overflow-hidden py-0  transition-all duration-1000 
        `}
      >
        <HeroCarousel />
      </section>

      {/* Features Section */}
      <section
        className={`py-20 bg-white dark:bg-gray-800 transition-all duration-1000 delay-200 
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Decora?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're committed to providing you with the best shopping experience and premium quality products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border-1 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the perfect pieces for every room in your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    Shop Now
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className={`py-20 bg-white dark:bg-gray-800 transition-all duration-1000 delay-400`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Handpicked favorites from our collection.</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-2xl p-4">
                  <SkeletonLoader variant="rectangular" height={200} className="mb-4" />
                  <SkeletonLoader variant="text" height={20} className="mb-2" />
                  <SkeletonLoader variant="text" height={16} width="60%" className="mb-2" />
                  <SkeletonLoader variant="text" height={20} width="40%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className={`group bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0] || "/placeholder.svg?height=250&width=300"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.price > product.discountPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                        {product.price > product.discountPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link to="/products">
              <Button size="lg">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest home decor trends, exclusive offers, and design inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home
