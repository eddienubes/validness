// do not remove, required
import * as express from 'express';
import { FormidablePayload } from '@src/validators/files/formidable/formidable-payload.interface.js';

declare global {
    namespace Express {
        export interface Request {
            formidablePayload?: FormidablePayload;
        }
    }
}
