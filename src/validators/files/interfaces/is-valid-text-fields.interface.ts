import { AnyObject, ErrorField } from '@src';

export interface IsValidTextFields {
    instance: AnyObject;
    violatedFields: ErrorField[];
}
