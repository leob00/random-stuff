const isTurbopack = process.env.TURBOPACK === '1'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   forceSwcTransforms: !isTurbopack ? true : undefined,
  // },
  // forceSwcTransforms: {
  //   forceSwcTransforms: !isTurbopack ? true : undefined,
  // },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  turbopack: {},
  output: 'standalone',
  //productionBrowserSourceMaps: false,
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.externals = config.externals || []
  //     config.module.rules.push({
  //       test: /\.(test|spec)\.(ts)x?$/,
  //       use: 'ignore-loader',
  //     })
  //   }
  //  return config
  //},
  excludeDefaultMomentLocales: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  serverExternalPackages: ['tesseract.js'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
  },
  images: {
    remotePatterns: [
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
      {
        protocol: 'https',
        hostname: 'debqyqoq9od6o.cloudfront.net',
        pathname: '**',
      },
    ],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [8, 16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
