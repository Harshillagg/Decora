import {Router} from "express"
import {verifyJwt} from "../middlewares/auth.middleware"
import {addToWishlist, removeFromWishlist, getWishlist, clearWishlist} from "../controllers/wishlist.controller"

const wishlistRouter = Router()

wishlistRouter.route("/add-to-wishlist").post(verifyJwt, addToWishlist)
wishlistRouter.route("/remove-from-wishlist/:productId").delete(verifyJwt, removeFromWishlist)
wishlistRouter.route("/get-wishlist").get(verifyJwt, getWishlist)
wishlistRouter.route("/clear-wishlist").delete(verifyJwt, clearWishlist)

export default wishlistRouter