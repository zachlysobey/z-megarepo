// Multi-project Jest configuration for Next.js app
// This configuration separates unit tests (node environment) from component tests (jsdom environment)
// 
// Note: We use babel-jest with next/babel instead of next/jest's createJestConfig helper
// because next/jest doesn't properly support multi-project configurations. The transform
// configuration needs to be explicitly defined for each project to work correctly.

const baseConfig = {
    moduleNameMapper: {
        // Handle module aliases
        '^@/(.*)$': '<rootDir>/$1',
    },
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    collectCoverageFrom: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/.next/**',
    ],
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
}

const config = {
    projects: [
        // Unit tests project - uses node environment for pure unit tests
        {
            ...baseConfig,
            displayName: 'unit',
            testEnvironment: 'node',
            testMatch: ['**/*.unit.test.{js,ts}'],
        },
        // Component tests project - uses jsdom environment for React component tests
        {
            ...baseConfig,
            displayName: 'component',
            testEnvironment: 'jest-environment-jsdom',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
            testMatch: ['**/*.component.test.{jsx,tsx}'],
        },
    ],
}

export default config
