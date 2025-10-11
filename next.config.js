/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: false,
  compress: false,
  images: {
    unoptimized: true,
  },
  // Force all routes to be dynamic to avoid static export crashes on Heroku
  // and reduce concurrency during build
  experimental: {
    forceSwcTransforms: true,
    workerThreads: false,
    cpus: 1,
    instrumentationHook: true,
  },
  typescript: {
    // Do not block builds on type errors in CI
    ignoreBuildErrors: true,
  },
  eslint: {
    // We already skip lint in build script; ensure Next doesn’t run it
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
