import { Router } from 'express';
import { ClassConstructor } from '../../common';
import { FileValidationConfig } from '../../config/file-validation-config.interface';
import { ConfigStore } from '../../config';
import { processFileDtoConstructor } from './multer/process-file-dto-constructor';
import { FILE_VALIDATOR_CHAIN_MAP } from './constants';

/**
 * File validation consists of 3 stages (3 middlewares)
 * 1. Setup core upload middleware (mostly config of the underlying library)
 * 2. Applying of validator middleware
 * 3. Core validator result modification
 */
export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const processedFileDtoConstructor = processFileDtoConstructor(DtoConstructor);

    const validatorType = fileValidationConfig?.fileValidatorType || configStore.fileValidationConfig.fileValidatorType;

    const chainGetter = FILE_VALIDATOR_CHAIN_MAP[validatorType];

    return chainGetter(DtoConstructor, processedFileDtoConstructor, fileValidationConfig);
};
