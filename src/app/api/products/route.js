import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// GET: Fetch all products
export async function GET(request) {
  await dbConnect();

  try {
    const products = await Product.find({}); // Fetch all products from DB
    return NextResponse.json(products); // Return as JSON response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new product
export async function POST(request) {
  await dbConnect();
  
  const session = await getServerSession(authOptions); // Get session data
  console.log("SESSION:", session);

  
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to add a product" }, { status: 403 });
  }

  // Ensure user ID is available in the session
  if (!session.user || !session.user.id) {
    return NextResponse.json({ error: "User ID is missing in the session" }, { status: 400 });
  }

  const body = await request.json();

  // Attach userId from session to the new product
  const newProduct = {
    ...body,
    userId: session.user.id, // Ensure each product is associated with the user
  };

  try {
    const createdProduct = await Product.create(newProduct); // Save new product in DB
    return NextResponse.json({ product: createdProduct, ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
