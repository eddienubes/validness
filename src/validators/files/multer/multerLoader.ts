import { createRequire } from 'node:module';
import { ValidnessError } from '@src/common/errors/validness.error.js';

const require = createRequire(import.meta.url);

export const loadMulter = () => {
    try {
        return require('multer');
    } catch (e) {
        throw new ValidnessError(
            'multer is not installed. Please install it by running `npm/yarn/pnpm install multer`'
        );
    }
};
