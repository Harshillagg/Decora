import mongoose, { Schema, type Document } from "mongoose";

export interface CartItemProps {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartProps extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItemProps[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItemProps>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
});

const cartSchema = new Schema<CartProps>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<CartProps>("Cart", cartSchema);

export default Cart;
