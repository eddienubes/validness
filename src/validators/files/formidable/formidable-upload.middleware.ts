import { RequestHandler } from 'express';
import formidable from 'formidable';
import { Options } from 'formidable';
import { AnyObject } from '../../../common';

export const formidableUploadMiddleware =
    (coreConfig?: Options): RequestHandler =>
    async (req, res, next) => {
        const form = formidable(coreConfig);
        form.parse(req, (err, fields, files) => {
            req.formidablePayload = {
                error: err as AnyObject,
                fields,
                files
            };

            return next();
        });
    };
