import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest/jest-setup.ts'],
    roots: ['<rootDir>/test'],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.base.json'
        }
    }
};

export default config;
