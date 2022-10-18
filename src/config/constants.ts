import { ValidationConfig, FileValidatorType } from '@src';

export const VALIDATION_CONFIG_DEFAULTS: ValidationConfig = {
    bodyValidationConfig: { forbidNonWhitelisted: true },
    queryValidationConfig: { forbidNonWhitelisted: true },
    customErrorFactory: undefined,

    fileValidationConfig: {
        fileValidatorType: FileValidatorType.MULTER,
        coreConfig: {
            multiples: true
        },

        textFieldsValidationConfig: {
            forbidNonWhitelisted: true
        }
    }
};
