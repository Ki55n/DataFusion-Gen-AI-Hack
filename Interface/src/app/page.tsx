"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user }: any = UserAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to the login page if not authenticated
    } else {
      router.push("/dashboard/projects");
    }
  }, [user, router]);
  return <div>Data Fusion</div>;
}
