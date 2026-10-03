import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { findViolatedFields } from '../../utils/find-violated-fields.ts';
import { FileValidationMap } from './types.ts';
import { ClassConstructor } from '../../common/interfaces/class-constructor.interface.ts';
import { AnyObject } from '../../common/types/types.ts';
import { IsValidTextFields } from './interfaces/is-valid-text-fields.interface.ts';

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
