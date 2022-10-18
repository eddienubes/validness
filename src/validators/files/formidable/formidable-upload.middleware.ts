import { RequestHandler } from 'express';
import formidable, { Options } from 'formidable';

export const formidableUploadMiddleware =
    (coreConfig: Options): RequestHandler =>
    async (req, res, next) => {
        const form = formidable(coreConfig);
        form.parse(req, (err, fields, files) => {
            req.formidablePayload = {
                error: err,
                fields,
                files
            };

            return next();
        });
    };
