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
    <html lang="en" suppressHydrationWarning data-darkreader-disable="true" data-theme="light">
      <head>
        {/* Disable DarkReader before any content loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Set attribute immediately
                document.documentElement.setAttribute('data-darkreader-disable', 'true');

                // Also try to disable via DarkReader API if available
                if (typeof window !== 'undefined') {
                  window.addEventListener('DOMContentLoaded', function() {
                    if (window.darkreader) {
                      window.darkreader.disable();
                    }
                  });
                }
              })();
            `,
          }}
        />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="light antialiased"
        data-darkreader-disable="true"
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
