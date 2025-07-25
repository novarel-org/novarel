const config = {
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/tests/**/*.test.ts',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

module.exports = config;