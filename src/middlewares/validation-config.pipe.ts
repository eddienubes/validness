import { RequestHandler } from 'express';
import { ValidationConfig } from './validation-config.interface';

export const validationConfigPipe =
    (config: ValidationConfig): RequestHandler =>
    (req, res, next) => {
        for (const key in config) {
            req[key] = config[key];
        }

        next();
    };
