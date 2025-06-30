import type { Config } from 'jest'
const config: Config = {
  preset: 'ts-jest',
  verbose: false,
  collectCoverage: true,
  collectCoverageFrom: ['lib/util/**/*.{ts,tsx}', '!lib/util/tsUtil.ts', '!lib/util/timers.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/components/$1',
    '^hooks/(.*)$': '<rootDir>/hooks/$1',
  },
}

export default config
