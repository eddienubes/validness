import { AnyObject } from '@src/common/types/types.js';
import type { errors, Fields, Files } from 'formidable';

export interface FormidablePayload {
    error?: typeof errors.FormidableError | null;
    fields?: Fields | null;
    files?: Files | null;
    validatedFields?: AnyObject;
}
