/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com', 'images.unsplash.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
  }
  
  export default nextConfig