// do not remove, required
import * as express from 'express';
import { FormidablePayload } from '../../validators/files/formidable/formidable-payload.interface.ts';

declare global {
    namespace Express {
        export interface Request {
            formidablePayload?: FormidablePayload;
        }
    }
}
