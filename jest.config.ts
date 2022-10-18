import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest/jest-setup.ts'],
    roots: ['<rootDir>/test'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
        '^@src': '<rootDir>/src',
        '^@test': '<rootDir>/test'
    },
    coverageDirectory: './jest/coverage',
    coverageReporters: ['json-summary', 'text', 'lcov']
};

export default config;
