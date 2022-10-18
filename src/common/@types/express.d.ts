// do not remove, required
import * as express from 'express';
import { FormidablePayload } from '@src/validators/files/formidable/formidable-payload.interface';

declare global {
    namespace Express {
        export interface Request {
            formidablePayload?: FormidablePayload;
        }
    }
}
