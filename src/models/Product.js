import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
},
{
  timestamps: true,
}

);
const Products = mongoose.models.Stocks || mongoose.model("Stocks", productSchema);


export default Products;
