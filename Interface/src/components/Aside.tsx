"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Use Link instead of <a> for better routing
import { usePathname } from "next/navigation";
import { GrCatalog } from "react-icons/gr";
import { CiCreditCard1, CiCalendarDate, CiUser } from "react-icons/ci";
import { LuPackage } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import Spinner from "./Spinner";
import { UserAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function Aside() {
  const { user, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);

  const currentRoute = usePathname();
  const routes = [
    { route: "/dashboard/projects", icon: <GrCatalog />, name: "Projects" },
    {
      route: "/dashboard/active-projects",
      icon: <LuPackage />,
      name: "Active Projects",
    },
    { route: "/dashboard/visualizer", icon: <CiUser />, name: "Visualizer" },
    { route: "/dashboard/cleaner", icon: <CiCreditCard1 />, name: "Cleaner" },
    {
      route: "/dashboard/chat-with-data",
      icon: <CiCalendarDate />,
      name: "Chat with data",
    },
  ];

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logOut();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-56 bg-gray-800 flex h-screen flex-col justify-start py-8 px-4 shadow-lg">
      <div className="space-y-6">
        <div className="w-full flex justify-center items-center">
          <Image src="/logo.png" width={105} height={60} alt="logo" />
        </div>
        <div className="pb-4">
          <hr className=" border-white/50" />
        </div>

        <div className=" flex gap-2 flex-col">
          {routes.map((route, index) => (
            <Link href={route.route} key={`route-${index}`}>
              <div
                className={`flex items-center gap-6 p-3 rounded-lg transition-colors ${
                  currentRoute === route.route
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-xl">{route.icon}</span>
                <span className="text-lg font-medium">{route.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center">
        {loading ? (
          <Spinner />
        ) : user ? (
          <div className="flex flex-col items-center py-2">
            <div className="pb-4 w-full">
              <hr className=" border-white/50" />
            </div>
            <FaUserCircle className="text-white text-3xl py-2" />
            <p className="text-white font-bold">{user?.displayName}</p>
            <button
              className="text-white font-bold mt-2"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-white font-bold">
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
