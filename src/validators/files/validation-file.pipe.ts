import { Router } from 'express';
import { ConfigStore } from '../../config/config-store.ts';
import { processFileDtoConstructor } from './process-file-dto-constructor.ts';
import { ClassConstructor } from '../../common/interfaces/class-constructor.interface.ts';
import { FileValidationConfig } from '../../config/file-validation-config.interface.ts';
import { FileValidatorType } from '../../common/enums/file-validator-type.enum.ts';
import { FileValidationChainGetter } from './multer/types.ts';
import { getMulterFileValidationChain } from './multer/get-multer-file-validation-chain.ts';
import { getFormidableValidationChain } from './formidable/get-formidable-validation-chain.ts';

export const FILE_VALIDATOR_CHAIN_MAP: Record<
    FileValidatorType,
    FileValidationChainGetter
> = {
    [FileValidatorType.MULTER]: getMulterFileValidationChain,
    [FileValidatorType.FORMIDABLE]: getFormidableValidationChain
};

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
    const processedFileDtoConstructor =
        processFileDtoConstructor(DtoConstructor);

    // TODO: Global store set by user is unavailable here. Validness() hasn't been called yet
    const validatorType =
        config?.fileValidatorType ||
        configStore.fileValidationConfig.fileValidatorType;

    const chainGetter = FILE_VALIDATOR_CHAIN_MAP[validatorType];

    return chainGetter(DtoConstructor, processedFileDtoConstructor, config);
};
