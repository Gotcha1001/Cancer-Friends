import React, { useState } from "react";
import { auth } from "../firebaseconfig/firebase"; // Adjust the import path as necessary
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-black via-red-500 to-yellow-600">
      <div className="password-reset-container w-full max-w-md rounded-lg bg-black p-8 text-center shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">Reset Password</h2>
        <form onSubmit={handlePasswordReset} autoComplete="off">
          <div className="mb-4 text-left">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border border-gray-300 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-900"
          >
            Send Password Reset Email
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-white">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
