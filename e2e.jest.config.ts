import { type Config } from 'jest'
import baseConfig from './jest.config'

const config: Config = {
  ...baseConfig,
  roots: ['<rootDir>/src/'],
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'],
}

export default config
