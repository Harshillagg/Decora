import type { Request, Response } from "express"
import Product from "../models/product.model"
import { validationResult } from "express-validator"

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10
    const page = Number(req.query.page) || 1
    const category = req.query.category || ""
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {}

    const categoryFilter = category ? { category } : {}
    const priceMin = req.query.priceMin ? { price: { $gte: Number(req.query.priceMin) } } : {}
    const priceMax = req.query.priceMax ? { price: { $lte: Number(req.query.priceMax) } } : {}
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Combine filters
    const filter = {
      ...keyword,
      ...categoryFilter,
      ...priceMin,
      ...priceMax,
    }

    const count = await Product.countDocuments(filter)

    const products = await Product.find(filter)
      .sort({ [sortBy as string]: sortOrder })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, description, price, discountPrice, images, category, stock, isNew, isFeatured, isSale } = req.body

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
      isNew,
      isFeatured,
      isSale,
      rating: 0,
      reviews: [],
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, description, price, discountPrice, images, category, stock, isNew, isFeatured, isSale } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice
    product.images = images || product.images
    product.category = category || product.category
    product.stock = stock !== undefined ? stock : product.stock
    product.isNew = isNew !== undefined ? isNew : product.isNew
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured
    product.isSale = isSale !== undefined ? isSale : product.isSale

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.deleteOne()
    res.json({ message: "Product removed" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find((r) => r.userId.toString() === req.user._id.toString())

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" })
    }

    const review = {
      userId: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    }

    product.reviews.push(review)

    // Update product rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: "Review added" })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
