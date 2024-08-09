// Login.jsx
import React, { useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "../firebaseconfig/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const adminEmail = "admin@example.com";


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Skip email verification check for the admin email
      if (user.email !== adminEmail && !user.emailVerified) {
        // Sign out the user and show an alert if email is not verified
        await signOut(auth);
        alert("Please verify your email before trying to log in.");
        return;
      }

      // Redirect to home page after successful login and email verification
      navigate("/");
    } catch (error) {
      // Handle errors for admin email separately
      if (email === adminEmail) {
        alert("Admin login error: Please check your password or contact support.");
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Incorrect email or password. Please try again or register.");
      } else {
        alert("Error logging in user: Please check your password");
      }
    }
  };



  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setEmail(""); // Clear email field
      setPassword(""); // Clear password field
      setErrorMessage(""); // Clear error message
      setUser(null); // Reset user state
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Clear form fields when the user state changes
    setEmail("");
    setPassword("");
  }, [user]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-black via-red-500 to-yellow-600">
      {user ? (
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-white">
            Welcome, {user.email}
          </h2>
          <button
            className="rounded-sm bg-teal-500 px-6 py-3 text-lg text-teal-100 hover:bg-teal-700"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="login-form w-full max-w-md rounded-lg bg-black p-8 text-center shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-white">Login</h2>
          {errorMessage && (
            <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
          )}
          <form onSubmit={handleLogin} autoComplete="off">
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
                name="email"
                className="w-full rounded-md border border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 text-left">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-md border border-gray-300 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-900"
            >
              Login
            </button>
          </form>
          <div className="mt-4">
            <button
              className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-teal-700"
              onClick={signInWithGoogle}
            >
              Login with Google
            </button>
          </div>
          <div className="mt-4">
            <Link
              to="/reset-password"
              className="text-sm text-teal-500 transition duration-300 ease-in-out hover:text-yellow-500"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;


