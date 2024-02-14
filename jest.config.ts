import type { Config } from '@jest/types';
import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': [
            'ts-jest',
            {
                useESM: true
            }
        ]
    },
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
    roots: ['<rootDir>/test'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        useESM: true
    }),
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json-summary', 'text', 'lcov']
};

export default config;
