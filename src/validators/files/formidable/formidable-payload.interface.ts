import { AnyObject } from '../../../common';
import { Fields, Files } from 'formidable';

export interface FormidablePayload {
    error?: AnyObject;
    fields: Fields;
    files: Files;
}
