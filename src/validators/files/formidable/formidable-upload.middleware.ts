import { RequestHandler } from 'express';
import type { Options, errors } from 'formidable';
import { loadFormidable } from '@src/validators/files/formidable/formidableLoader.js';

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
                error: e as typeof errors.FormidableError
            };
        }

        return next();
    };
};
