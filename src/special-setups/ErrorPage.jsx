import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    const imageUrl = 'https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/Gamingpic.jpg?raw=true'; // Replace with your actual image URL

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 gradient-background2">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-5xl font-bold text-red-500 mb-4">Oops!</h1>
                <p className="text-lg mb-6">Sorry, an unexpected error has occurred.</p>

                {/* Image */}
                <img
                    src={imageUrl}
                    alt="Error Image"
                    className="mx-auto mb-4 rounded-lg shadow-lg max-w-full h-auto" // Adjusted styles for centering and resizing
                    style={{ maxWidth: '400px' }} // Set maximum width for responsiveness
                />

                {/* Link */}
                <Link
                    to="/"
                    className="inline-block bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded hover:bg-blue-600"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
