"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { X } from "lucide-react";

const Header = ({ showLoginForm, setShowLoginForm }) => {
  const { data: session } = useSession();

  return (
    <>
      <header className="text-gray-600 body-font bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
          {/* Left Side Logo & Title */}
          <a className="flex title-font font-medium items-center text-gray-900 dark:text-white mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">Stock Management System</span>
          </a>

          {/* Center Navigation Links */}
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a className="mr-5 hover:text-gray-900">First Link</a>
            <a className="mr-5 hover:text-gray-900">Second Link</a>
            <a className="mr-5 hover:text-gray-900">Third Link</a>
            <a className="mr-5 hover:text-gray-900">Fourth Link</a>
          </nav>

          {/* Right Side Auth Buttons */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <img
                  src={session.user.image}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-800 dark:text-white text-sm font-medium">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
              onClick={() => setShowLoginForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowLoginForm(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <p className="mb-6 text-gray-600">Sign in to continue</p>
            <button
              onClick={() => signIn("google")}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;