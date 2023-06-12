import { ValidationConfig, FileValidatorType } from '@src';

export const VALIDATION_CONFIG_DEFAULTS: ValidationConfig = {
    bodyValidationConfig: { forbidNonWhitelisted: true, contentTypes: ['application/json'] },
    queryValidationConfig: {
        forbidNonWhitelisted: true,
        contentTypes: [] // empty array means any
    },
    customErrorFactory: undefined,
    contentTypes: undefined,

    fileValidationConfig: {
        fileValidatorType: FileValidatorType.MULTER,
        coreConfig: {
            multiples: true
        },

        textFieldsValidationConfig: {
            forbidNonWhitelisted: true
        },

        contentTypes: ['multipart/form-data']
    }
};
