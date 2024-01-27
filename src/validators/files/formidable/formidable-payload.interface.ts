import { errors, Fields, Files } from 'formidable';

export interface FormidablePayload {
    error?: typeof errors.FormidableError | null;
    fields: Fields | null;
    files: Files | null;
}
