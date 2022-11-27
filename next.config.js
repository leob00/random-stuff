/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  swcMinify: true,
  images: {
    domains: [
      'dev-rendomstuff00.pantheonsite.io',
      'images.ctfassets.net',
      'cdn2.thecatapi.com',
      'images.dog.ceo',
      'imgs.xkcd.com',
      'cso88ynaac.execute-api.us-east-1.amazonaws.com',
    ],
    //deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    //imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
}

module.exports = nextConfig
