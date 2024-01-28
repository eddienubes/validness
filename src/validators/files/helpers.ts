import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { AnyObject, ClassConstructor, IsValidTextFields } from '@src/index.js';
import { findViolatedFields } from '@src/utils/find-violated-fields.js';
import { FileValidationMap } from '@src/validators/files/types.js';

export const isValidTextFields = async (
    DtoConstructor: ClassConstructor,
    input: AnyObject,
    fileValidationMap: FileValidationMap,
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
