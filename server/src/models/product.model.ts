import mongoose, { type Document, Schema } from "mongoose";

export interface ReviewProps {
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductProps extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: string;
  stock: number;
  isNewProduct: boolean;
  isFeatured: boolean;
  isSale: boolean;
  reviews: ReviewProps[];
  tags: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewProps>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new Schema<ProductProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
    tags: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model<ProductProps>("Product", productSchema);

export default Product;
