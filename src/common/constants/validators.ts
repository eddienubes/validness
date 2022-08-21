import { FileValidatorType } from '../enums/file-validator-type.enum';
import { ValidationConfig } from '../../config';

export const VALIDATION_CONFIG_DEFAULTS: ValidationConfig = {
    bodyValidationConfig: { forbidNonWhitelisted: true },
    queryValidationConfig: { forbidNonWhitelisted: true },
    customErrorFactory: undefined,

    coreFileValidatorType: FileValidatorType.MULTER
};
