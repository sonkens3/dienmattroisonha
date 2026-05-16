import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const isGithubPagesCustomDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN === "true";
const githubPagesRepo = process.env.GITHUB_PAGES_REPO ?? "dienmattroisonha";
const githubPagesBasePath = isGithubPages && !isGithubPagesCustomDomain ? `/${githubPagesRepo}` : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: githubPagesBasePath || undefined,
  assetPrefix: githubPagesBasePath ? `${githubPagesBasePath}/` : undefined,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
