import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add userId
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Stocks || mongoose.model("Stocks", productSchema);
export default Product;

