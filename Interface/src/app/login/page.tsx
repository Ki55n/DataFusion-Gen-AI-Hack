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
  const [loginError, setLoginError] = useState("");
  const [loadingVerification, setLoadingVerification] = useState(false);
  const { user, loading: authLoading, googleSignIn }: any = UserAuth(); // Use 'loading' from auth context

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard/projects"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(email, password);

      if (result?.user?.emailVerified) {
        router.push("/dashboard/projects");
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
          <Image
            alt="Google"
            src={"/google-logo.svg"}
            height={20}
            width={20}
            className="mr-3"
          />
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
