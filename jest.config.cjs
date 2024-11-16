module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.svg$': '<rootDir>/src/__mocks__/fileMock.js',
        '\\.css$': 'identity-obj-proxy',
        '^firebase/auth$': '<rootDir>/src/__mocks__/firebase/auth.js'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    transformIgnorePatterns: [
        'node_modules/(?!(firebase|@firebase)/)'
    ]
};