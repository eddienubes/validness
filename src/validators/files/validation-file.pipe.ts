import { Router } from 'express';
import multer from 'multer';
import { ClassConstructor } from '../../common';
import { FileValidationConfig } from '../../config/file-validation-config.interface';
import { ConfigStore } from '../../config';
import { fileFilter } from './multer/file-filter';
import { processFileDtoConstructor } from './multer/process-file-dto-constructor';

/**
 * File validation consists of 3 stages (3 middlewares)
 * 1. Setup core validator middleware
 * 2. Core validator applying middleware
 * 3. Core validator result modification middleware
 */
const router = Router();

export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): Router => {
    const configStore = ConfigStore.getInstance().getConfig();
    const { fileValidationMap, multerFields } = processFileDtoConstructor(DtoConstructor);

    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    const uploadMiddleware = multer({
        ...coreConfig,
        fileFilter: fileFilter(fileValidationMap)
    }).fields(multerFields);

    router.use(uploadMiddleware, async (req, res, next) => {
        console.log(req.file);
        console.log(req.files);
        console.log(req.body);

        next();
    });

    return router;
};
