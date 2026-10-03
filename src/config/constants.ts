import { ValidationConfig } from './validation-config.interface.ts';
import { FileValidatorType } from '../common/enums/file-validator-type.enum.ts';

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
