import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificationMiddleware } from './multer-modification.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor } from '../../../common';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { ConfigStore } from '../../../config';

export const getMulterFileValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const router = Router();

    console.log('getMulterFileValidationChain: ', DtoConstructor.name, processedFileDtoConstructor.multerFields);
    const configStore = ConfigStore.getInstance().getConfig();
    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    router.use(
        multerUploadMiddleware(processedFileDtoConstructor, DtoConstructor, coreConfig),
        multerValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        multerModificationMiddleware(processedFileDtoConstructor)
    );

    return router;
};
