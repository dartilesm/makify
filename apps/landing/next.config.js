/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@makify/ui'],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
