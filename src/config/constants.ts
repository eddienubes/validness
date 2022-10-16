import { ValidationConfig } from './validation-config.interface';
import { FileValidatorType } from '../common';

export const VALIDATION_CONFIG_DEFAULTS: ValidationConfig = {
    bodyValidationConfig: { forbidNonWhitelisted: true },
    queryValidationConfig: { forbidNonWhitelisted: true },
    customErrorFactory: undefined,

    fileValidationConfig: {
        fileValidatorType: FileValidatorType.MULTER,
        coreConfig: undefined,

        textFieldsValidationConfig: {
            forbidNonWhitelisted: true
        }
    }
};
