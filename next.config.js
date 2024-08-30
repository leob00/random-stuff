/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    // domains: [
    //   'dev-rendomstuff00.pantheonsite.io',
    //   'images.ctfassets.net',
    //   'cdn2.thecatapi.com',
    //   'images.dog.ceo',
    //   'imgs.xkcd.com',
    //   'cso88ynaac.execute-api.us-east-1.amazonaws.com',
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cso88ynaac.execute-api.us-east-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.dog.ceo',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com',
        pathname: '**',
      },
    ],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    // Enables the styled-components SWC transform
    //styledComponents: true,
  },
}

module.exports = nextConfig
