import {Router} from "express"
import {verifyJwt} from "../middlewares/auth.middleware"
import {addToCart, removeFromCart, getCart, clearCart} from "../controllers/cart.controller"

const cartRouter = Router()

cartRouter.route("/add-to-cart").post(verifyJwt, addToCart)
cartRouter.route("/remove-from-cart/:productId").delete(verifyJwt, removeFromCart)
cartRouter.route("/get-cart").get(verifyJwt, getCart)
cartRouter.route("/clear-cart").delete(verifyJwt, clearCart)

export default cartRouter