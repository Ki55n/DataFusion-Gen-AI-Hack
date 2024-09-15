"use client";
import { useState, useEffect } from "react";
import {
  useSignInWithEmailAndPassword,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, userCredential, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, sendingReset, resetError] =
    useSendPasswordResetEmail(auth);
  const router = useRouter();
  const { googleSignIn } = UserAuth();
  const [loginError, setLoginError] = useState("");
  const [loadingVerification, setLoadingVerification] = useState(false);

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(email, password);

      if (result?.user?.emailVerified) {
        router.push("/home/catalog");
      } else {
        setLoginError("Email not verified. Please check your inbox.");
        await auth.signOut(); // Force sign out if not verified
      }
    } catch (e) {
      console.error(e);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setLoginError("Google sign-in failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLoginError("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(email);
      setLoginError("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error(error);
      setLoginError("Failed to send password reset email. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      setLoginError("Login failed. Please check your credentials.");
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900"
      style={{
        backgroundImage: "url('/auth-bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-400 transition text-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-400 transition text-white placeholder-gray-400"
        />
        {loginError && (
          <div className="mb-4 text-red-500 text-center">{loginError}</div>
        )}
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition shadow-md"
          disabled={loading || loadingVerification}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center my-4 text-gray-400">or</div>

        <button
          onClick={handleSignInWithGoogle}
          className="flex items-center justify-center w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.674 11.24c0-.748-.068-1.464-.187-2.154H12v4.07h5.961c-.257 1.29-.998 2.381-2.112 3.109v2.566h3.418c2.006-1.85 3.156-4.569 3.156-7.591z"
              fill="#4285F4"
            />
            <path
              d="M12 23c3.106 0 5.705-1.034 7.606-2.806l-3.418-2.566c-.948.635-2.145 1.015-3.569 1.015-2.749 0-5.073-1.856-5.906-4.348H4.2v2.735C6.089 20.975 8.848 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M6.094 14.295a6.95 6.95 0 01-.365-2.295c0-.796.133-1.565.365-2.295V6.97H4.2a10.972 10.972 0 000 9.86l1.894-2.535z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.856c1.512 0 2.868.52 3.937 1.542l2.936-2.936C16.59 1.977 14.284 1 12 1 8.848 1 6.089 3.025 4.2 6.971l1.894 2.735c.834-2.492 3.158-4.348 5.906-4.348z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-indigo-400 hover:underline"
            disabled={sendingReset}
          >
            {sendingReset ? "Sending..." : "Forgot password?"}
          </button>
          <a href="/signup" className="text-sm text-indigo-400 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
