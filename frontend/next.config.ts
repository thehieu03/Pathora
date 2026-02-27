import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
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

export default nextConfig;
