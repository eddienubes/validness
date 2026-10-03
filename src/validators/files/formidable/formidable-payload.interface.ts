import { AnyObject } from '../../../common/types/types.ts';
import type { FormidableError, Fields, Files } from 'formidable';

export interface FormidablePayload {
    error?: FormidableError | null;
    fields?: Fields | null;
    files?: Files | null;
    validatedFields?: AnyObject;
}
