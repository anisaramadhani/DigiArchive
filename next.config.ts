// next.config.ts
import type { NextConfig } from 'next';

const repoName = 'DigiArchive'; 

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // WAJIB untuk GitHub Pages
  output: 'export',

  // WAJIB agar Image tidak error
  images: {
    unoptimized: true,
  },

  // WAJIB jika repo BUKAN username.github.io
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
