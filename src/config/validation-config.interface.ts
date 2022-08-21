import { ValidatorOptions } from '@nestjs/class-validator';
import { CustomErrorFactory } from '../common/types/types';
import { FileValidatorType } from '../common/enums/file-validator-type.enum';

export interface ValidationConfig {
    [key: string]: ValidatorOptions | CustomErrorFactory | FileValidatorType | undefined;

    queryValidationConfig: ValidatorOptions;
    bodyValidationConfig: ValidatorOptions;
    customErrorFactory?: CustomErrorFactory;

    coreFileValidatorType: FileValidatorType;
}
