import { ValidnessError } from '@src/common/errors/validness.error.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const loadFormidable = () => {
    try {
        const formidable = require('formidable');
        return formidable;
    } catch (e) {
        throw new ValidnessError(
            'formidable is not installed. Please install it by running `npm/yarn/pnpm install formidable`'
        );
    }
};
