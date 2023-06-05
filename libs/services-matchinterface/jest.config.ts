/* eslint-disable */
export default {
  displayName: 'services-matchinterface',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/services-matchinterface',
  testPathIgnorePatterns: [
    "\\.mockdata\\.spec\\.ts$" // Exclude files matching "*.mockdata.spec.ts" pattern
  ]
};
