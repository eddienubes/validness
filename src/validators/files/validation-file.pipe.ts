import { Router } from 'express';
import { ConfigStore } from '@src/config/config-store.js';
import { processFileDtoConstructor } from '@src/validators/files/process-file-dto-constructor.js';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';
import { FileValidatorType } from '@src/common/enums/file-validator-type.enum.js';
import { FileValidationChainGetter } from '@src/validators/files/multer/types.js';
import { getMulterFileValidationChain } from '@src/validators/files/multer/get-multer-file-validation-chain.js';
import { getFormidableValidationChain } from '@src/validators/files/formidable/get-formidable-validation-chain.js';

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
