import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { findViolatedFields } from '@src/utils/find-violated-fields.js';
import { FileValidationMap } from '@src/validators/files/types.js';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { AnyObject } from '@src/common/types/types.js';
import { IsValidTextFields } from '@src/validators/files/interfaces/is-valid-text-fields.interface.js';

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

export const isValidMimeType = (
    required: string | string[],
    actual: string
): boolean => {
    if (Array.isArray(required)) {
        return required.includes(actual);
    }

    return required === actual;
};
