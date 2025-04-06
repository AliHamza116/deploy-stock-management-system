"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";

function Page() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!productName || !quantity || !price || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    // Wrap the fetch operation with toast.promise
    toast.promise(
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          quantity: Number(quantity),
          price: Number(price),
          category,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Failed to add product");
          }
        })
        .then(() => {
          setProductName("");
          setQuantity("");
          setPrice("");
          setCategory("");
          fetchProducts(); // Refresh product list
        }),
      {
        loading: "Adding product...",
        success: <b>Product added successfully! ✅</b>,
        error: <b>Failed to add product ❌</b>,
      }
    );
  };

  const handleupdateProduct = () => {
    if (!editProduct) return; // If there's no product to update, exit early

    if (!productName || !quantity || !price || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    // Wrap the fetch operation with toast.promise
    toast.promise(
      fetch(`/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          quantity: Number(quantity),
          price: Number(price),
          category,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Failed to update product");
          }
        })
        .then(() => {
          setEditProduct(null);
          setProductName("");
          setQuantity("");
          setPrice("");
          setCategory("");
          fetchProducts(); // Refresh product list
        }),
      {
        loading: "Updating product...",
        success: <b>Product updated successfully! ✅</b>,
        error: <b>Failed to update product ❌</b>,
      }
    );
  };

  const handleDeleteProduct = async (id) => {
    // Confirm deletion with the user if needed
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    // Perform the delete action
    toast.promise(
      fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete product");
          }
          return res.json();
        })
        .then(() => {
          // Refresh the product list after successful deletion
          fetchProducts();
        }),
      {
        loading: "Deleting product...",
        success: <b>Product deleted successfully! ✅</b>,
        error: <b>Failed to delete product ❌</b>,
      }
    );
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setProductName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price);
    setCategory(product.category);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add a Product</h1>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full col-span-3"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
              <option value="Other">Others</option>
            </select>
          </div>

          {editProduct ? (
            <button
              onClick={handleupdateProduct}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 btn"
            >
              Update Product
            </button>
          ) : (
            <button
              onClick={handleAddProduct}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 btn"
            >
              Add Product
            </button>
          )}
        </div>

        <h1 className="text-xl font-semibold">Current Stock</h1>
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search for a product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded w-1/3"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="groceries">Groceries</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .filter((p) =>
                  searchCategory ? p.category === searchCategory : true
                )
                .map((prod, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{prod.name}</td>
                    <td className="border px-4 py-2">{prod.quantity}</td>
                    <td className="border px-4 py-2">${prod.price}</td>
                    <td className="border px-4 py-2">{prod.category}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditClick(prod)}
                        className="bg-blue-500 text-white px-3 py-1 rounded btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 btn btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Page;
