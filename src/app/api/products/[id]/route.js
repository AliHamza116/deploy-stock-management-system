import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectToDB();

    const products = await Product.find();

    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}

export async function POST(request) {
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPERADMINEMAIL; // Read from .env file

  try {
    const { name, quantity, price, category, createdBy, userId } = await request.json();

    await connectToDB();

    const newProduct = new Product({
      name,
      quantity,
      price,
      category,
      createdBy,
      userId,
    });

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // If the user is a superadmin, allow them to add any product
    if (createdBy === superAdminEmail || user.email === createdBy) {
      await newProduct.save();
      return NextResponse.json(newProduct);
    }

    return new NextResponse("Only superadmin or the product creator can add products.", { status: 403 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to add product", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPERADMINEMAIL; // Read from .env file

  try {
    const { id } = params;
    const { name, quantity, price, category } = await request.json();

    await connectToDB();

    const product = await Product.findById(id);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const user = await User.findById(product.userId);
    const isSuperAdmin = user?.email === superAdminEmail;

    // If the logged-in user is the superadmin or the creator of the product, allow them to update
    if (isSuperAdmin || product.createdBy === user?.email) {
      product.name = name;
      product.quantity = quantity;
      product.price = price;
      product.category = category;

      await product.save();
      return NextResponse.json(product);
    }

    return new NextResponse("Only superadmin or the product creator can update the product.", { status: 403 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to update product", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPERADMINEMAIL; // Read from .env file

  try {
    const { id } = params;

    await connectToDB();

    const product = await Product.findById(id);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const user = await User.findById(product.userId);
    const isSuperAdmin = user?.email === superAdminEmail;

    // Only the superadmin or the product creator can delete the product
    if (isSuperAdmin || product.createdBy === user?.email) {
      await Product.findByIdAndDelete(id);
      return new NextResponse("Product deleted successfully", { status: 200 });
    }

    return new NextResponse("Only superadmin or the product creator can delete the product.", { status: 403 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to delete product", { status: 500 });
  }
}
