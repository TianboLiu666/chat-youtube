import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/components/QueryProviders";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Youtube",
  description: "Chat and Get Transcript of Youtube Videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders>
      <html lang="en">
        <body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    </QueryProviders>
  );
}
