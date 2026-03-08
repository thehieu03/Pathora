import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { buildThemeInitScript } from "@/hooks/themePreference";

export const metadata: Metadata = {
  title: "Pathora",
  description: "Pathora web",
};

const themeInitScript = buildThemeInitScript();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="light antialiased"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
