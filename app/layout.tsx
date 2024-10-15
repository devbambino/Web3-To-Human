import type { Metadata } from "next";
import Navbar from "./components/navegation/navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 To Human App v1",
  description: "Simplifying the complex Web3 concepts for actual humans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
