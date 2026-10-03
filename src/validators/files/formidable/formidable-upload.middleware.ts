import { RequestHandler } from 'express';
import type { Options, FormidableError } from 'formidable';
import { loadFormidable } from './formidableLoader.ts';

export const formidableUploadMiddleware = (
    coreConfig: Options
): RequestHandler => {
    const formidable = loadFormidable();

    return async (req, res, next) => {
        const form = formidable.formidable(coreConfig);
        try {
            const [fields, files] = await form.parse(req);

            req.formidablePayload = {
                fields,
                files
            };
        } catch (e) {
            req.formidablePayload = {
                error: e as FormidableError
            };
        }

        return next();
    };
};
