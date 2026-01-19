//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = composePlugins(withNx)(nextConfig);
