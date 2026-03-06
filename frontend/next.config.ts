import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname: string;
  port?: string;
};

const parseRemoteImagePatterns = (
  value: string | undefined,
): RemotePattern[] => {
  if (!value) return [];

  const seen = new Set<string>();
  const patterns: RemotePattern[] = [];

  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      try {
        const normalized = entry.includes("://")
          ? entry
          : `https://${entry.replace(/^\/\//, "")}`;
        const url = new URL(normalized);
        const protocol = url.protocol === "http:" ? "http" : "https";
        const hostname = url.hostname.toLowerCase();
        const port = url.port || undefined;
        const key = `${protocol}://${hostname}:${port ?? ""}`;

        if (!hostname || seen.has(key)) return;
        seen.add(key);
        patterns.push({
          protocol,
          hostname,
          pathname: "/**",
          ...(port ? { port } : {}),
        });
      } catch {
        // Ignore invalid hosts so one bad entry does not break build.
      }
    });

  return patterns;
};

const envRemotePatterns = parseRemoteImagePatterns(
  process.env.NEXT_PUBLIC_REMOTE_IMAGE_HOSTS,
);

const allowUnoptimized = process.env.NEXT_PUBLIC_IMAGES_UNOPTIMIZED === "true";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // When MinIO runs on localhost (private IP), Next.js image optimizer
    // blocks it. Set NEXT_PUBLIC_IMAGES_UNOPTIMIZED=true to bypass.
    unoptimized: allowUnoptimized,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      ...envRemotePatterns,
    ],
  },
};

const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyze(nextConfig);
