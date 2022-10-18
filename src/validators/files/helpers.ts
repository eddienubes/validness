import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { findViolatedFields, AnyObject, ClassConstructor } from '@src';
import { IsValidTextFields } from './interfaces/is-valid-text-fields.interface';

export const isValidTextFields = async (
    DtoConstructor: ClassConstructor,
    input: AnyObject,
    validationConfig?: ValidatorOptions
): Promise<IsValidTextFields> => {
    const instance = plainToInstance(DtoConstructor, input);

    const textFieldsErrors = await validate(instance, validationConfig);
    const violatedFields = findViolatedFields(textFieldsErrors);

    return {
        violatedFields,
        instance
    };
};

export const isValidMimeType = (required: string | string[], actual: string): boolean => {
    if (Array.isArray(required)) {
        return required.includes(actual);
    }

    return required === actual;
};
