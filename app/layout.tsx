import type { Metadata } from "next";
import { Libre_Franklin, Spectral } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const head = Spectral({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-head",
});
const body = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Daily Desh — डेली देश",
  description: "ताज़ा ख़बरें, देश-विदेश, राजनीति, खेल और अपराध की हर बड़ी ख़बर।",
  openGraph: {
    title: "Daily Desh — डेली देश",
    description: "ताज़ा ख़बरें, देश-विदेश, राजनीति, खेल और अपराध की हर बड़ी ख़बर।",
    type: "website",
  },
};

const NAV = [
  ["देश", "desh"],
  ["विदेश", "videsh"],
  ["राजनीति", "politics"],
  ["खेल", "sports"],
  ["अपराध", "crime"],
  ["मनोरंजन", "entertainment"],
  ["व्यापार", "business"],
  ["टेक्नोलॉजी", "technology"],
  ["स्वास्थ्य", "health"],
  ["शिक्षा", "education"],
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${head.variable} ${body.variable} font-body`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark'||(!('theme'in localStorage)&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <header className="border-b-2 border-ink dark:border-neutral-700">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-head text-3xl font-extrabold tracking-tight text-masthead">
                डेली देश
              </span>
              <span className="font-head text-2xl font-bold tracking-tight">
                Daily Desh
              </span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden text-neutral-500 sm:inline">
                {new Date().toLocaleDateString("hi-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <ThemeToggle />
              <Link
                href="/admin"
                className="rounded bg-masthead px-3 py-1.5 font-medium text-white hover:opacity-90"
              >
                एडमिन
              </Link>
            </div>
          </div>
          <nav className="border-t border-neutral-200 dark:border-neutral-800">
            <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm font-medium">
              {NAV.map(([label, slug]) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="whitespace-nowrap rounded px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t-2 border-ink py-8 dark:border-neutral-700">
          <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-500">
            © {new Date().getFullYear()} Daily Desh · डेली देश. Next.js + Supabase.
          </div>
        </footer>
      </body>
    </html>
  );
}
