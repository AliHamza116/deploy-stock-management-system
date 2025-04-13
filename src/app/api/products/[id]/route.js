import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PUT: Edit a product by ID
export async function PUT(request, { params }) {
  await dbConnect(); // Connect to DB
  const { id } = params; // Extract product ID from params
  const body = await request.json(); // Get the request body
  const session = await getServerSession(authOptions); // Get session data
  console.log("SESSION:", session);

  if (!session) {
    return NextResponse.json({ error: "You must be logged in to edit a product" }, { status: 403 });
  }

  // Find the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check if the logged-in user is the superadmin or owns the product
  // if (session.user.email !== 'alihamzaafzal888@gmail.com' && product.userId.toString() !== session.user.id) {
  //   return NextResponse.json({ error: "You are not authorized to edit this product" }, { status: 403 });
  // }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: body }, { new: true }); // Update the product
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request, context) {
  await dbConnect(); // Connect to DB

  const { params } = context;
  const { id } = params; // Extract product ID from params
  const session = await getServerSession(authOptions); // Get session data

  if (!session) {
    return NextResponse.json({ error: "You must be logged in to delete a product" }, { status: 403 });
  }

  // Find the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check if the logged-in user is the superadmin or owns the product
  // if (session.user.email !== 'alihamzaafzal888@gmail.com' && product.userId.toString() !== session.user.id) {
  //   return NextResponse.json({ error: "You are not authorized to delete this product" }, { status: 403 });
  // }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id); // Delete the product
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
