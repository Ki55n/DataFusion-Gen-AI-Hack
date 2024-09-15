import type { Metadata } from "next";
import Aside from "@/components/Aside";
import React from "react";
import Header from "@/components/Header";
import Providers from "@/app/providers";
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
          <main className="flex h-screen">
            {/* Fixed Sidebar */}
            <Aside />

            {/* Main Content */}
            <div className="flex-grow p-6 overflow-y-auto h-screen">
              {/* Header remains at the top of the main content */}
              {/* <Header user={user} /> */}

              {/* Children content area */}
              <div className="flex-grow">{children}</div>
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
