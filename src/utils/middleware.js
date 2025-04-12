import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Assuming you're using next-auth for authentication

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Extract product ID from URL
  const id = req.nextUrl.pathname.split("/").pop();

  // Fetch the product from the database (if you want ownership check here)
  // Note: You can't do DB queries directly in middleware in production — instead, consider doing it inside API routes or page protection.

  return NextResponse.next();
}

export const config = {
  matcher: ["/:id/edit", "/:id/delete"], // Apply middleware to these routes
};
