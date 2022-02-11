import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest/jest-setup.ts'],
    roots: ['<rootDir>/tests']
};

export default config;
