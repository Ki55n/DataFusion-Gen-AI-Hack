import type { Metadata } from "next";
import Aside from "@/components/Aside";
import React from "react";
import Header from "@/components/Header";
import Providers from "@/app/providers";
import { FaMagic } from "react-icons/fa";
import Chatbot from "@/components/chatbot";

export const metadata: Metadata = {
  title: "Data fusion",
  description: "Data fusion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: "mamoon",
    email: "mamoom23@gmail.com",
    avatar: "/path/to/avatar.jpg",
  };

  return (
    <html>
      <body className="dark text-foreground bg-gray-900">
        <Providers>
          <main className="flex flex-col h-screen">
            {/* Header */}
            <Header user={user} />

            <div className="flex flex-grow">
              {/* Fixed Sidebar */}
              <Aside />

              {/* Main Content */}
              <div className="flex-grow p-6 overflow-y-auto">{children}</div>
            </div>

            {/* Chatbot fixed button */}
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              <Chatbot />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
