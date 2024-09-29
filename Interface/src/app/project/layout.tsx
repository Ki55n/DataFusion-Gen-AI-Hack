import type { Metadata } from "next";
import Aside from "@/components/Aside";
import React from "react";
import Providers from "@/app/providers";
import { AuthContextProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Data fusion",
  description: "Data fusion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="dark text-foreground bg-gray-900">
        <Providers>
          <main className="flex h-screen">
            {/* Fixed Sidebar */}
            <Aside />

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto h-screen">
              {/* Header remains at the top of the main content */}
              {/* <Header user={user} /> */}

              {/* Children content area */}
              <AuthContextProvider>
                <div className="flex-grow">{children}</div>
              </AuthContextProvider>
            </div>

            {/* Chatbot fixed button */}
          </main>
        </Providers>
      </body>
    </html>
  );
}
