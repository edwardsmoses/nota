const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
  preset: 'react-native',
  moduleDirectories: ['node_modules', 'src'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest',
    // '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
};
