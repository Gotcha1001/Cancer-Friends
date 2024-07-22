import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const imageUrl =
    "https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/Gamingpic.jpg?raw=true"; // Replace with your actual image URL

  return (
    <div className="gradient-background2 flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-5xl font-bold text-red-500">Oops!</h1>
        <p className="mb-6 text-lg">Sorry, an unexpected error has occurred.</p>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Error Image"
          className="mx-auto mb-4 h-auto max-w-full rounded-lg shadow-lg" // Adjusted styles for centering and resizing
          style={{ maxWidth: "400px" }} // Set maximum width for responsiveness
        />

        {/* Link */}
        <Link
          to="/"
          className="inline-block rounded bg-blue-500 px-4 py-2 text-lg font-semibold text-white hover:bg-blue-600"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
