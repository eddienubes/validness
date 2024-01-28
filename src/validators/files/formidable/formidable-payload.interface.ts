import { errors, Fields, Files } from 'formidable';
import { AnyObject } from '@src/index.js';

export interface FormidablePayload {
    error?: typeof errors.FormidableError | null;
    fields?: Fields | null;
    files?: Files | null;
    validatedFields?: AnyObject;
}
