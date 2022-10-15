import { Router } from 'express';
import { multerUploadMiddleware } from './multer-upload.middleware';
import { multerValidationMiddleware } from './multer-validation.middleware';
import { multerModificatorMiddleware } from './multer-modificator.middleware';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { ClassConstructor } from '../../../common';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { ConfigStore } from '../../../config';

const router = Router();

export const getMulterFileValidationChain = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    router.use(
        multerUploadMiddleware(processedFileDtoConstructor, coreConfig),
        multerValidationMiddleware(processedFileDtoConstructor, DtoConstructor, fileValidationConfig),
        multerModificatorMiddleware(processedFileDtoConstructor)
    );

    return router;
};
