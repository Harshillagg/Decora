import type { Response } from "express"
import Wishlist from "../models/wishlist.model"
import Product from "../models/product.model"
import CustomRequest from "../types/customRequest"
import asyncHandler from "../utils/asyncHandler"

// Get the user's wishlist
export const getWishlist = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products").lean()

    if (!wishlist) {
      return res.status(200).json({ products: [] })
    }

    res.status(200).json({ wishlist })
  } catch (error) {
    console.error("Get wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a product to the wishlist
export const addToWishlist = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { productId } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user._id,
        products: [productId],
      })
    } else {
      // Avoid duplicates
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId)
        await wishlist.save()
      }
    }

    res.status(200).json({ wishlist })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Remove a product from the wishlist
export const removeFromWishlist = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { productId } = req.params

    const wishlist = await Wishlist.findOne({ userId: req.user._id })
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    )
    await wishlist.save()

    res.status(200).json({ wishlist })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Clear the wishlist
export const clearWishlist = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    await Wishlist.findOneAndDelete({ userId: req.user._id })

    res.status(200).json({ message: "Wishlist cleared" })
  } catch (error) {
    console.error("Clear wishlist error:", error)
    res.status(500).json({ message: "Server error" })
  }
})
