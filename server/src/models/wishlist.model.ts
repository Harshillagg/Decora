import mongoose, { type Document, Schema } from "mongoose";

export interface WishlistProps extends Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<WishlistProps>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<WishlistProps>("Wishlist", wishlistSchema);

export default Wishlist;
