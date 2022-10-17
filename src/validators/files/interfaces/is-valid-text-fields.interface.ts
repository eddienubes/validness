import { AnyObject, ErrorField } from '../../../common';

export interface IsValidTextFields {
    instance: AnyObject;
    violatedFields: ErrorField[];
}
