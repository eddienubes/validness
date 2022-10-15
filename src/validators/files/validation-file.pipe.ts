import { Router } from 'express';
import { ClassConstructor } from '../../common';
import { FileValidationConfig } from '../../config/file-validation-config.interface';
import { ConfigStore } from '../../config';
import { processFileDtoConstructor } from './multer/process-file-dto-constructor';
import { multerUploadMiddleware } from './multer/multer-upload.middleware';

/**
 * File validation consists of 3 stages (3 middlewares)
 * 1. Setup core upload middleware (mostly config of the underlying library)
 * 2. Applying of validator middleware
 * 3. Core validator result modification middleware
 */
const router = Router();

export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const processedFileDtoConstructor = processFileDtoConstructor(DtoConstructor);

    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    router.use(multerUploadMiddleware(processedFileDtoConstructor, coreConfig), async (req, res, next) => {
        console.log(req.file);
        console.log(req.files);
        console.log(req.body);

        next();
    });

    return router;
};
