import { createRequire } from 'node:module';
import { ValidnessError } from '../../../common/errors/validness.error.ts';

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
