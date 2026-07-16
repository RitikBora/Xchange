import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/Appbar";
import { SiteFooter } from "./components/SiteFooter";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Market Screener & Real-Time Exchange Data | Track Trends & Prices",
  description: "Stay updated with live market trends, prices, and trading volumes. Your ultimate crypto market screening tool for informed decisions.",
};

// Theme resolution (runs before paint, no flash):
//   1. explicit stored choice ('xchange-ui-theme') wins
//   2. else follow the OS setting (prefers-color-scheme: dark)
//   3. else (light or undetectable) fall back to light
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('xchange-ui-theme');
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Appbar/>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
