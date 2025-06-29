import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['*__tests__*/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: { '\\.[jt]sx?$': 'babel-jest' },
}

export default config

// module.exports = {
//   collectCoverage: true,
//   collectCoverageFrom: ['*__tests__*/*.{ts,tsx}'],
//   coverageDirectory: 'coverage',
//   testEnvironment: 'jsdom',
// }
