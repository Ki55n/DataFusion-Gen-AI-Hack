"use client";
import { useEffect, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addUser, findUserByEmail } from "@/db/user";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, , createUserError] =
    useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification, sending, verificationError] =
    useSendEmailVerification(auth);
  const router = useRouter();
  const { googleSignIn, user, loading: authLoading } = UserAuth();
  const [popupVisible, setPopupVisible] = useState(false);
  const [alertmsg, setAlertmsg] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Password error state

  // useEffect(() => {
  //   if (!authLoading && user) {
  //     router.push("/login"); // Redirect to the login page if not authenticated
  //   }
  // }, [user, authLoading, router]);

  // Password validation logic
  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  const handleSignUp = async () => {
    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage); // Set the password error
      return;
    }

    try {
      // Check if user already exists in MongoDB
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        console.log("User already exists in MongoDB");
        setAlertmsg("User Already exists");
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          router.push("/login");
        }, 5000);
        return;
      }

      // Create user with email and password in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      console.log(email, password);

      if (userCredential) {
        // Firebase user ID
        const userId = userCredential.user.uid;

        // Create a new user in MongoDB
        await addUser(userId, "john doe", email, []);

        // Send email verification
        const success = await sendEmailVerification();
        if (success) {
          console.log("Verification email sent");
          setAlertmsg("Email verification sent! Redirecting to login...");
          setPopupVisible(true);

          // Show popup and redirect to login after delay
          setTimeout(() => {
            setPopupVisible(false);
            router.push("/login");
          }, 5000);

          setEmail("");
          setPassword("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      const user = auth.currentUser;
      if (user) {
        const existingUser = await findUserByEmail(user.email);
        if (existingUser) {
          console.log("User already exists in MongoDB");
          setAlertmsg("User Already exists");
          setPopupVisible(true);
          setTimeout(() => {
            setPopupVisible(false);
            router.push("/login");
          }, 5000);
          return;
        }

        const userId = user.uid; // Firebase UID
        const email = user.email || ""; // Email (if available)
        const name = user.displayName || ""; // Display name (if available)

        // Call your MongoDB function to add the user
        await addUser(userId, name, email, []);
        console.log(
          "User successfully signed in with Google and added to MongoDB"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          Sign Up
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
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(""); // Reset error when typing
          }}
          className="w-full p-3 mb-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-400 transition text-white placeholder-gray-400"
        />
        {passwordError && (
          <div className="text-red-500 text-sm mb-4">{passwordError}</div>
        )}
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition shadow-md"
          disabled={sending}
        >
          {sending ? "Sending Verification..." : "Sign Up"}
        </button>

        {popupVisible && (
          <div className="mt-4 p-3 bg-green-600 text-white text-center rounded-lg">
            {alertmsg}
          </div>
        )}

        <div className="text-center my-4 text-gray-400">or</div>

        <button
          onClick={handleSignIn}
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
          <div className="text-sm text-gray-400">Already have an account?</div>
          <a href="/login" className="text-sm text-indigo-400 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
