import React, { useState } from 'react';
import { auth } from '../firebaseconfig/firebase'; // Adjust the import path as necessary
import { sendPasswordResetEmail } from 'firebase/auth';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-red-500 to-yellow-600">
            <div className="password-reset-container p-8 rounded-lg shadow-lg text-center max-w-md w-full bg-black">
                <h2 className="mb-6 text-2xl font-bold text-white">Reset Password</h2>
                <form onSubmit={handlePasswordReset} autoComplete="off">
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gray-800 text-white rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-900"
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
