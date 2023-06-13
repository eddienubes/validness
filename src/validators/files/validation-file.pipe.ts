import { ClassConstructor, ConfigStore } from '@src';
import { processFileDtoConstructor } from './process-file-dto-constructor';
import { FILE_VALIDATOR_CHAIN_MAP } from './constants';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { Router } from 'express';

/**
 * File validation consists of 4 stages (4 middlewares)
 * 1. Setup core upload middleware (mostly config of the underlying library)
 * 2. Applying of validator middleware
 * 3. Core validator result modification
 * 4. Error handler - maps native underlying library error to a validness error
 */
export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    config?: Partial<FileValidationConfig>
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const processedFileDtoConstructor = processFileDtoConstructor(DtoConstructor);

    // TODO: Global store set by user is unavailable here. Validness() hasn't been called yet
    const validatorType = config?.fileValidatorType || configStore.fileValidationConfig.fileValidatorType;

    const chainGetter = FILE_VALIDATOR_CHAIN_MAP[validatorType];

    return chainGetter(DtoConstructor, processedFileDtoConstructor, config);
};
