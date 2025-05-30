import { Router } from "express"
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  // createProductReview 
} from "../controllers/product.controller"
import { verifyJwt, verifyAdmin } from "../middlewares/auth.middleware"

const productRouter = Router()

// Public routes
productRouter.route("/").get(getProducts)
productRouter.route("/:id").get(getProductById)

// Protected routes
// productRouter.route("/:id/reviews").post(
//   verifyJwt,
//   createProductReview
// )

// Admin routes
productRouter.route("/").post(
  verifyJwt,
  createProduct
)

productRouter.route("/:id").put(
  verifyJwt,
  verifyAdmin,
  updateProduct
).delete(
  verifyJwt,
  verifyAdmin,
  deleteProduct
)

export default productRouter