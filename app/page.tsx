import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black antialiased">
      <main className="max-w-4xl mx-auto py-20 px-6">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">ClientBook</h1>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Login
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-95"
            >
              Dashboard
            </Link>
          </nav>
        </header>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Intelligent client records, powered by AI
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                Paste freeform text, upload files or import data from external sources — AI will extract structured
                client records and keep the raw source for provenance. Built with Next.js, TailwindCSS and shadcn/ui.
              </p>

              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                >
                  Open Dashboard
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium dark:border-zinc-700"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-full h-48 border border-dashed border-zinc-200 rounded-lg flex items-center justify-center">
                <p className="text-zinc-400">Preview area — your app UI will appear here</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            Quick start: <span className="font-medium text-zinc-700 dark:text-zinc-200">Go to Login → use the admin
            credentials</span> or open the Dashboard directly if already signed in.
          </p>
        </footer>
      </main>
    </div>
  );
}
