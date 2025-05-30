import mongoose, { type Document, Schema } from "mongoose";
import { AddressProps } from "./user.model";
import { addressSchema } from "./user.model";

export interface OrderItemProps {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderProps extends Document {
  userId: mongoose.Types.ObjectId;
  items: OrderItemProps[];
  totalAmount: number;
  shippingAddress: AddressProps;
  paymentMethod: string;
  paymentId?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemProps>({
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
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new Schema<OrderProps>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderProps>("Order", orderSchema);

export default Order;
