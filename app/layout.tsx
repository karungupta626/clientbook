// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "ClientBook",
  description: "ClientBook — AI-assisted client bookkeeping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50 min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="w-full border-b border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold">
                ClientBook
              </Link>

              <nav className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Dashboard
                </Link>
                <Link href="/login" className="text-sm px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Login
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <Providers>
              {children}
            </Providers>
          </main>

          <footer className="w-full border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-zinc-500">
              © {new Date().getFullYear()} ClientBook — built with Next.js & Tailwind
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
