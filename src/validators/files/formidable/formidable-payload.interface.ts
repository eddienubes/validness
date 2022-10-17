import { errors, Fields, Files } from 'formidable';

export interface FormidablePayload {
    error?: typeof errors.FormidableError;
    fields: Fields;
    files: Files;
}
