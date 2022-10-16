import { Router } from 'express';
import { ClassConstructor, CustomErrorFactory } from '../../common';
import { FileValidationConfig } from '../../config/file-validation-config.interface';
import { ConfigStore } from '../../config';
import { processFileDtoConstructor } from './process-file-dto-constructor';
import { FILE_VALIDATOR_CHAIN_MAP } from './constants';

/**
 * File validation consists of 4 stages (4 middlewares)
 * 1. Setup core upload middleware (mostly config of the underlying library)
 * 2. Applying of validator middleware
 * 3. Core validator result modification
 * 4. Error handler - maps native underlying library error to a validness error
 */
export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const processedFileDtoConstructor = processFileDtoConstructor(DtoConstructor);

    const validatorType = fileValidationConfig?.fileValidatorType || configStore.fileValidationConfig.fileValidatorType;

    const chainGetter = FILE_VALIDATOR_CHAIN_MAP[validatorType];

    return chainGetter(DtoConstructor, processedFileDtoConstructor, fileValidationConfig, customErrorFactory);
};
