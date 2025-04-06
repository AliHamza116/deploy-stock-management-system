import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product.js";

// GET: Fetch all products
export async function GET(request) {
  await dbConnect();

  const products = await Product.find({});
  return NextResponse.json(products);
}

// POST: Add a new product
export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  try {
    const newProduct = await Product.create(body);
    return NextResponse.json({ product: newProduct, ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
