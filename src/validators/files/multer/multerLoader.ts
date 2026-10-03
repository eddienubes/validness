import { createRequire } from 'node:module';
import { ValidnessError } from '../../../common/errors/validness.error.ts';

const require = createRequire(import.meta.url);

export const loadMulter = (): any => {
    try {
        return require('multer');
    } catch {
        throw new ValidnessError(
            'multer is not installed. Please install it by running `npm/yarn/pnpm install multer`'
        );
    }
};
