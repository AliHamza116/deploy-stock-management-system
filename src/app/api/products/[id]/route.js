// app/api/products/[id]/route.js
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// PUT - Update a product
export async function PUT(request, { params }) {
  await dbConnect(); // connect to database

  const body = await request.json();
  const { id } = params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true } // return updated document
    );

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// DELETE - Delete a product
export async function DELETE(request, { params }) {
  await dbConnect(); // connect to database

  const { id } = params;

  try {
    // Find the product by id and remove it from the database
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
