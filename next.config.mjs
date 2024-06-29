/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amplience.net' },
      { protocol: 'https', hostname: '*.nyt.com' },
      { protocol: 'https', hostname: '*.unrealengine.com' }
    ]
  }
}

export default nextConfig
