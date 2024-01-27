import { RequestHandler } from 'express';
import formidable, { Options, errors } from 'formidable';

export const formidableUploadMiddleware =
    (coreConfig: Options): RequestHandler =>
    async (req, res, next) => {
        const form = formidable(coreConfig);
        try {
            const [fields, files] = await form.parse(req);

            req.formidablePayload = {
                error: null,
                fields,
                files
            };
        } catch (e) {
            req.formidablePayload = {
                error: e as typeof errors.FormidableError,
                fields: null,
                files: null
            };
        }

        return next();
    };
