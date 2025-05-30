"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Play, Star, Truck, Shield } from "lucide-react"

interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  badge?: string
  features?: string[]
  gradient: string
}

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "outline"
  size?: "md" | "lg"
  className?: string
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
  const variants = {
    primary: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg",
    outline: "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
  }
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true)

  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "Transform Your",
      subtitle: "Living Space",
      description: "Discover premium home decor and furniture that brings comfort, style, and personality to every room.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      ctaText: "Shop Collection",
      ctaLink: "/products",
      secondaryCtaText: "Watch Video",
      badge: "New Collection",
      features: ["Free Shipping", "30-Day Returns", "Premium Quality"],
      gradient: "from-blue-600 via-purple-600 to-pink-600",
    },
    {
      id: 2,
      title: "Luxury Furniture",
      subtitle: "For Modern Homes",
      description: "Elevate your home with our curated selection of contemporary furniture designed for the modern lifestyle.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center",
      ctaText: "Explore Furniture",
      ctaLink: "/products?category=furniture",
      badge: "Best Sellers",
      features: ["Designer Quality", "Sustainable Materials", "Expert Craftsmanship"],
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    },
    {
      id: 3,
      title: "Cozy Bedroom",
      subtitle: "Essentials",
      description: "Create your perfect sanctuary with our bedroom collection featuring comfortable and stylish pieces.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center",
      ctaText: "Shop Bedroom",
      ctaLink: "/products?category=bedroom",
      secondaryCtaText: "Design Guide",
      badge: "Up to 40% Off",
      features: ["Comfort Guaranteed", "Easy Assembly", "Warranty Included"],
      gradient: "from-rose-600 via-pink-600 to-purple-600",
    },
    {
      id: 4,
      title: "Kitchen & Dining",
      subtitle: "Reimagined",
      description: "Transform your culinary space with our modern kitchen and dining solutions that blend function with style.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      ctaText: "Shop Kitchen",
      ctaLink: "/products?category=kitchen",
      badge: "Limited Time",
      features: ["Durable Materials", "Easy Maintenance", "Space Efficient"],
      gradient: "from-orange-600 via-red-600 to-pink-600",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const goToSlide = (index: number): void => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const getFeatureIcon = (index: number): React.ReactNode => {
    switch (index) {
      case 0:
        return <Truck className="w-4 h-4 text-blue-300" />
      case 1:
        return <Shield className="w-4 h-4 text-green-300" />
      case 2:
        return <Star className="w-4 h-4 text-yellow-300" />
      default:
        return <Star className="w-4 h-4 text-yellow-300" />
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative h-[70vh] min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        {/* Slides Container with Sliding Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0 scale-100"
                  : index < currentSlide
                    ? "opacity-0 -translate-x-full scale-95"
                    : "opacity-0 translate-x-full scale-95"
              }`}
            >
              {/* Background Image and Overlay */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80`} />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content for this slide */}
              <div className="absolute inset-0 h-full flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-20">
                {/* Badge */}
                {slide.badge && (
                  <div className={`inline-flex items-center px-6 py-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold text-white mb-6 transition-all duration-700 delay-300 ${
                    index === currentSlide ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}>
                    <Star className="w-4 h-4 mr-2 text-yellow-300" />
                    {slide.badge}
                  </div>
                )}

                {/* Main Content */}
                <div className="space-y-6 max-w-4xl">
                  <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight transition-all duration-700 delay-500 ${
                    index === currentSlide ? "animate-slide-up opacity-100" : "opacity-0 translate-y-12"
                  }`}>
                    {slide.title}
                    <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {slide.subtitle}
                    </span>
                  </h1>
                  
                  <p className={`text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-700 ${
                    index === currentSlide ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}>
                    {slide.description}
                  </p>
                </div>

                {/* Features */}
                {slide.features && (
                  <div className={`flex flex-wrap justify-center gap-4 mt-8 mb-8 transition-all duration-700 delay-900 ${
                    index === currentSlide ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}>
                    {slide.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"
                        style={{ animationDelay: `${900 + idx * 100}ms` }}
                      >
                        {getFeatureIcon(idx)}
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-1100 ${
                  index === currentSlide ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}>
                  <Button size="lg" className="group min-w-[180px]">
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {slide.secondaryCtaText && (
                    <Button variant="outline" size="lg" className="group min-w-[180px]">
                      <Play className="w-5 h-5 mr-2" />
                      {slide.secondaryCtaText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-white scale-125 shadow-lg" 
                    : "bg-white/50 hover:bg-white/75 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes slide-up {
            from { 
              opacity: 0; 
              transform: translateY(30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  )
}

export default HeroCarousel