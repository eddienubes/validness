import { ValidationConfig } from '@src/config/validation-config.interface.js';
import { FileValidatorType } from '@src/common/enums/file-validator-type.enum.js';

export const VALIDATION_CONFIG_DEFAULTS: ValidationConfig = {
    bodyValidationConfig: { contentTypes: ['application/json'] },
    queryValidationConfig: {
        contentTypes: [] // empty array means any
    },
    customErrorFactory: undefined,
    contentTypes: undefined,

    fileValidationConfig: {
        fileValidatorType: FileValidatorType.MULTER,
        coreConfig: {
            multiples: true
        },

        textFieldsValidationConfig: {},

        contentTypes: ['multipart/form-data']
    }
};
