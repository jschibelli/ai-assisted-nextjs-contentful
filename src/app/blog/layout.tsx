// src/app/blog/layout.tsx
import React from "react";
import Link from "next/link";
import { AppProvider } from "@/context/AppContext";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <BlogHeader />
        <main className="flex-grow">{children}</main>
        <BlogFooter />
      </div>
    </AppProvider>
  );
}
