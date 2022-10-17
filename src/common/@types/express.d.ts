// do not remove, required
import * as express from 'express';
import { FormidablePayload } from '../../validators/files/formidable/formidable-payload.interface';

declare global {
    namespace Express {
        export interface Request {
            formidablePayload?: FormidablePayload;
        }
    }
}
