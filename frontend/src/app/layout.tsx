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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
