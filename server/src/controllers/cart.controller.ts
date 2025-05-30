import type { Response } from "express"
import Cart from "../models/cart.model"
import Product from "../models/product.model"
import CustomRequest from "../types/customRequest"
import asyncHandler from "../utils/asyncHandler"

export const getCart = asyncHandler( async (req: CustomRequest, res: Response) => {
  try {
    if(!req.user) return res.status(401).json({
      message: "Unauthorized"
    })

    const cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 })
    }

    return res.status(201).json({
        cart
    })
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export const addToCart = asyncHandler( async (req: CustomRequest, res: Response) => {
  try {
    if(!req.user) return res.status(401).json({
      message: "Unauthorized"
    })

    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" })
    }

    let cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
        totalPrice: 0,
      })
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    const price = product.discountPrice != 0 ? product.discountPrice : product.price

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({
        productId: productId,
        name: product.name,
        price,
        image: product.images[0],
        quantity,
      })
    }

    cart.totalPrice = cart.totalPrice + price * quantity

    await cart.save()
    res.status(201).json({cart})
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export const removeFromCart = asyncHandler( async (req: CustomRequest, res: Response) => {
  try {
    if(!req.user) return res.status(401).json({
      message: "Unauthorized"
    })

    const { productId } = req.params

    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    // Remove item from cart
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    await cart.save()
    res.json(cart)
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export const clearCart = asyncHandler( async (req: CustomRequest, res: Response) => {
  try {
    if(!req.user) return res.status(401).json({
      message: "Unauthorized"
    })

    // Find and remove user's cart
    await Cart.findOneAndDelete({ userId: req.user._id })
    res.json({ message: "Cart cleared" })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})
